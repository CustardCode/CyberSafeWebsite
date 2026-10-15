const allowedServices = new Set(['Cyber Security Check-Up','Two-Factor Authentication Setup','Home Wi-Fi Security','Computer Security Review','Backup & Recovery Review','Email & Account Protection','Scam & Online Security Guidance','Something Else / Not Sure']);
export const config={rateLimit:{windowLimit:5,windowSize:60,aggregateBy:['ip','domain']}};
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export function validate(data,now=Date.now()){
 if(!data||typeof data!=='object'||Array.isArray(data))return 'Invalid enquiry.';
 if(typeof data.website!=='string'||data.website)return 'Please call Josh to discuss your enquiry.';
 const limits={name:[1,100],email:[3,254],phone:[0,40],location:[1,150],message:[10,3000]};
 for(const [key,[min,max]] of Object.entries(limits)){if(typeof data[key]!=='string'||data[key].trim().length<min||data[key].length>max||/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(data[key]))return 'Please check your '+key+'.';}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||/[\r\n]/.test(data.email))return 'Please enter a valid email address.';
 if(!allowedServices.has(data.service))return 'Please select an available service.';
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.submissionId||''))return 'Please refresh the form and try again.';
 if(typeof data.started!=='number'||now-data.started<2500||now-data.started>86400000)return 'Please take a moment to complete the form, or refresh it.';
 return null;
}
export default async function handler(request){
 if(request.method!=='POST')return json(405,{error:'Method not allowed.'});
 const origin=process.env.SITE_ORIGIN;
 if(!origin||request.headers.get('origin')!==origin)return json(403,{error:'This enquiry must be submitted from the configured website.'});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json(415,{error:'Unsupported request format.'});
 if(Number(request.headers.get('content-length'))>16000)return json(413,{error:'Your enquiry is too long.'});
 const text=await request.text();if(new TextEncoder().encode(text).length>16000)return json(413,{error:'Your enquiry is too long.'});
 let data;try{data=JSON.parse(text);}catch{return json(400,{error:'Invalid enquiry.'});}
 const error=validate(data);if(error)return json(400,{error});
 const {RESEND_API_KEY,CONTACT_TO_EMAIL,CONTACT_FROM_EMAIL}=process.env;
 if(!RESEND_API_KEY||!CONTACT_TO_EMAIL||!CONTACT_FROM_EMAIL)return json(503,{error:'Online enquiries are not available yet. Please call Josh on 0409 224 814. Nothing has been sent.'});
 // Plain-text email only; user input is never interpolated into HTML or headers.
 try{
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'enquiry/'+data.submissionId},body:JSON.stringify({from:CONTACT_FROM_EMAIL,to:[CONTACT_TO_EMAIL],reply_to:data.email,subject:'CyberSafe SW website enquiry',text:['Name: '+data.name,'Email: '+data.email,'Phone: '+data.phone,'Location: '+data.location,'Service: '+data.service,'','Message:',data.message].join('\n')}),signal:AbortSignal.timeout(12000)});
  if(!response.ok)return json(502,{error:'Delivery could not be confirmed. Please call Josh, or retry once.'});
  const result=await response.json();if(!result.id)return json(502,{error:'Delivery could not be confirmed. Please call Josh.'});
  return json(200,{success:true});
 }catch{return json(502,{error:'Delivery could not be confirmed. Please call Josh, or retry once.'});}
}
