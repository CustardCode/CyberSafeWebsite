"""Regenerate the branded fictional six-page report. Requires reportlab; PDF ships prebuilt."""
from pathlib import Path
import json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/assets/cybersafe-sw-sample-report.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
FONT_DIR = Path('C:/Windows/Fonts')
for name, file in [('Body','arial.ttf'),('Bold','arialbd.ttf'),('Editorial','georgia.ttf'),('Italic','georgiai.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR/file)))
W,H=A4
NAVY=HexColor('#102b39'); TEAL=HexColor('#a1e7d5'); GREEN=HexColor('#176753'); MUTED=HexColor('#586870'); LINE=HexColor('#dce3df'); PAPER=HexColor('#f8f9f5')
C=canvas.Canvas(str(OUT), pagesize=A4)
C.setTitle('CyberSafe SW - Sample Cyber Security Check-Up Report')
C.setAuthor('CyberSafe SW');C.setSubject('Fictional example for illustration only')
def text(x,y,s,size=11,font='Body',colour=NAVY):
    C.setFillColor(colour);C.setFont(font,size);C.drawString(x,y,s)
def paragraph(s,x,y,width=490,size=11,colour=MUTED,leading=None,font='Body'):
    style=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.6,textColor=colour)
    p=Paragraph(s,style);pw,ph=p.wrap(width,H)
    assert y-ph>56, f'Paragraph overflows page: {s[:80]}'
    p.drawOn(C,x,y-ph);return y-ph
def line(y,x=48,width=499):
    C.setStrokeColor(LINE);C.setLineWidth(.6);C.line(x,y,x+width,y)
def mark(x,y,scale=1,colour=GREEN):
    C.saveState();C.translate(x,y);C.scale(scale,scale);C.setFillColor(colour);C.setStrokeColor(colour)
    for points in [[(8,39),(28,39),(20,29),(8,29)],[(40,29),(20,29),(28,19),(40,19)],[(8,19),(28,19),(18,8)]]:
        p=C.beginPath();p.moveTo(*points[0]);[p.lineTo(*pt) for pt in points[1:]];p.close();C.drawPath(p,fill=1,stroke=0)
    C.setLineWidth(3)
    for a,b in [((28,39),(40,29)),((20,29),(8,19)),((28,19),(40,29))]:C.line(*a,*b)
    C.restoreState()
def header(page,title,kicker):
    C.setFillColor(PAPER);C.rect(0,0,W,H,fill=1,stroke=0)
    mark(40,H-83,.85);text(88,H-56,'CyberSafe SW',16,'Bold');text(88,H-72,'LOCAL KNOWLEDGE. DIGITAL CONFIDENCE.',6,'Body',MUTED)
    text(W-195,H-55,'SAMPLE REPORT',8,'Bold',GREEN);text(W-195,H-70,'FOR ILLUSTRATION ONLY',6,'Body',MUTED)
    line(H-98);text(48,H-137,kicker.upper(),8,'Bold',GREEN)
    text(48,H-184,title,30,'Editorial');return H-213
def footer(page,dark=False):
    colour=TEAL if dark else MUTED
    C.setStrokeColor(HexColor('#3f5d68') if dark else LINE);C.line(48,48,W-48,48)
    text(48,31,'SAMPLE REPORT - FOR ILLUSTRATION ONLY',7,'Bold',colour)
    text(W-147,31,f'CYBERSAFE SW   /   {page:02d}',7,'Body',colour)
    C.showPage()
def card(y,status,title,body,tone,width=499):
    colour=HexColor({'red':'#a43d30','amber':'#865d19','good':'#216b52'}[tone])
    C.setFillColor(white);C.roundRect(48,y-83,width,83,5,fill=1,stroke=0)
    C.setFillColor(colour);C.rect(48,y-83,3,83,fill=1,stroke=0)
    text(65,y-20,status.upper(),8,'Bold',colour);text(65,y-40,title,13,'Bold')
    paragraph(body,65,y-51,width-34,9.5,leading=14.3);return y-95

# 1 / COVER
C.setFillColor(NAVY);C.rect(0,0,W,H,fill=1,stroke=0)
mark(41,H-104,1.2,TEAL);text(107,H-62,'CyberSafe SW',23,'Bold',white);text(108,H-79,'LOCAL KNOWLEDGE. DIGITAL CONFIDENCE.',7,'Body',TEAL)
C.setStrokeColor(HexColor('#3f5d68'));C.setLineWidth(.6)
for r in [95,151,211]:C.circle(500,460,r,fill=0,stroke=1)
C.line(294,460,595,460);C.line(500,210,500,705)
text(48,664,'A CLEAR PICTURE. A PRACTICAL WAY FORWARD.',9,'Bold',TEAL)
text(46,593,'Cyber Security',47,'Editorial',white);text(46,534,'Check-Up',51,'Italic',TEAL)
paragraph('Example assessment report',48,480,390,18,white,26)
paragraph('A fictional small business scenario showing the clear findings, priorities and next steps a report can contain.',48,439,330,12,HexColor('#c8d8dc'),20)
C.setFillColor(HexColor('#214450'));C.roundRect(48,217,499,101,6,fill=1,stroke=0)
text(68,286,'SAMPLE REPORT - FOR ILLUSTRATION ONLY',9,'Bold',TEAL)
paragraph('No real customer, account or assessment results are represented. Actual checks and reporting depend on the agreed scope and package.',68,268,453,10.5,white,17)
text(48,143,'BUNBURY & SOUTH WEST WA',8,'Bold',TEAL);text(48,119,'cybersafesw.com  |  0409 224 814',11,'Body',white)
footer(1,True)

# 2 / EXECUTIVE SUMMARY
y=header(2,'A clearer picture.','01 / Executive summary')
y=paragraph('This example considers a fictional small business with one reviewed Windows computer, a primary email account, Wi-Fi and existing backup arrangements.',48,y)
y-=29
for x,count,label,col in [(48,'2','Action recommended','#a43d30'),(219,'2','Worth reviewing','#865d19'),(390,'2','Looking good','#216b52')]:
    C.setFillColor(white);C.roundRect(x,y-94,157,94,5,fill=1,stroke=0);text(x+16,y-42,count,32,'Editorial',HexColor(col));text(x+16,y-73,label,9,'Bold',HexColor(col))
y-=125;text(48,y,'What matters most',18,'Editorial');y-=20
y=paragraph('Start with sign-in protection for the primary email account and review the use of administrator access. Then verify that backups can recover files and review guest Wi-Fi arrangements.',48,y)
y-=31
y=card(y,'Action recommended','Account access needs attention','Two-factor authentication is not enabled on the primary email account. The everyday Windows account has administrator privileges.','red')
y=card(y,'Worth reviewing','Backups and network arrangements','Successful file recovery has not been verified. Guest devices use the same network as business devices.','amber')
y=card(y,'Looking good','Useful protections are already in place','Automatic operating system updates and built-in device protection are enabled in this fictional example.','good')
footer(2)

# 3 / ASSESSED AREAS
y=header(3,'What we checked.','02 / Defined scope')
y=paragraph('The agreed example scope covers six areas. The list below describes the kind of evidence considered; it does not promise the same checks in every real assessment.',48,y)
y-=28
rows=[('01','Email sign-in','Two-factor authentication and recovery arrangements.'),('02','Windows account access','Everyday account type and administrator privileges.'),('03','Backup & recovery','Configured backups and evidence of successful file recovery.'),('04','Wi-Fi arrangements','Guest access and separation from work devices.'),('05','Operating system updates','Automatic update setting and visible update status.'),('06','Device protection','Enabled protection and reported definition status.')]
for n,title,desc in rows:
    line(y);text(48,y-25,n,9,'Bold',GREEN);text(84,y-24,title,13,'Bold');paragraph(desc,84,y-35,445,10,leading=15);y-=67
y-=15;text(48,y,'Not included in this example',16,'Editorial');y-=17
paragraph('Penetration testing, every device or cloud setting, historical incident analysis, ongoing monitoring and formal compliance certification are outside this example scope.',48,y,499,10,leading=16)
footer(3)

# 4 / FINDINGS
y=header(4,'Where to focus first.','03 / Findings & priorities')
data=json.loads((ROOT/'report-data.json').read_text(encoding='utf-8'))
for i,f in enumerate(data[:4]):
    colour=HexColor('#a43d30' if f['tone']=='red' else '#865d19')
    text(48,y,f'F0{i+1}  /  '+f['status'].upper(),8,'Bold',colour);y-=25
    text(48,y,f['title'],15,'Bold');y-=13
    y=paragraph('<b>Observed:</b> '+f['observation'],48,y,499,9.5,leading=14)
    y-=6;y=paragraph('<b>Recommended:</b> '+f['action'],48,y,499,9.5,leading=14)
    y-=13;line(y);y-=24
footer(4)

# 5 / NEXT STEPS AND GOOD FINDINGS
y=header(5,'Your practical next steps.','04 / An order of action')
y=card(y,'Looking good - F05','Keep automatic updates enabled','Automatic operating system updates are enabled. Periodically review update history, restart requirements and relevant applications.','good')
y=card(y,'Looking good - F06','Maintain device protection','Built-in protection is enabled and reports current definitions. Review warnings; the reported state does not prove threats are absent.','good')
y-=26;text(48,y,'A sensible action plan',19,'Editorial');y-=27
actions=[('01','Start with account access.','Enable supported two-factor authentication and review administrator use with the account owner.'),('02','Test recovery safely.','Restore a non-sensitive test file to a separate location and confirm important files are covered.'),('03','Review the network.','Check guest Wi-Fi options. Agree changes before interrupting connectivity.'),('04','Maintain what is working.','Keep updates and protection enabled, and review their status regularly.')]
for n,title,desc in actions:
    text(48,y,n,9,'Bold',GREEN);text(82,y,title,12,'Bold');y=paragraph(desc,82,y-11,459,10,leading=15)-24
y-=2
paragraph('Agree an owner for each action and a review date that suits the environment. Implementation is separate from this example assessment unless explicitly included in the service.',48,y,499,10,leading=16)
footer(5)

# 6 / LIMITATIONS
y=header(6,'Clear boundaries matter.','05 / Scope & limitations')
sections=[('Entirely fictional information.','This is a marketing example, not a real assessment. No real customer, device, account, visit or finding is represented.'),('A point-in-time review.','A Cyber Security Check-Up reviews agreed areas using the information and access available at the time. Settings and threats can change after the review.'),('No guarantee of complete protection.','The assessment cannot establish that systems are completely secure, detect every threat or guarantee future outcomes. It is not a formal certified audit, penetration test, compliance certification or ongoing monitoring service.'),('Scope and permission come first.','Available checks depend on the environment, access permissions and agreed service. Changes, recovery tests and additional work require appropriate permission and an agreed scope. Reporting is supplied where the assessment package includes it.'),('Evidence and information handling.','The handling of assessment evidence and delivery of any report must be agreed before the visit. No proprietary toolkit code, confidential information or internal scoring algorithms are included here.')]
for title,body in sections:
    text(48,y,title,14,'Bold');y-=13;y=paragraph(body,48,y,499,10.5,leading=16.5)-27
C.setFillColor(NAVY);C.roundRect(48,88,499,77,6,fill=1,stroke=0);text(68,138,'Not sure where your security stands?',17,'Editorial',white);text(68,112,'Talk to Josh  /  0409 224 814  /  cybersafesw.com',10,'Body',TEAL)
footer(6)
C.save()
print(f'Created six-page sample report: {OUT}')
