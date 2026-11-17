from PIL import Image, ImageDraw, ImageFont
FP='/tmp/cricket_channel_project_v2/assets/NotoSansDevanagari-VariableFont_wdth_wght.ttf'
W,H=1280,720
def font(sz,w=900):
    f=ImageFont.truetype(FP,sz); f.set_variation_by_axes([w,100]); return f
def stroke(d,xy,t,f,fill,anchor='lm',sw=8):
    d.text(xy,t,font=f,fill=fill,anchor=anchor,stroke_width=sw,stroke_fill=(0,0,0))
TEAMS=[('KKR',(110,70,170)),('LSG',(0,168,224)),('CSK',(249,205,5)),('MI',(0,110,210)),('SRH',(255,130,42)),
       ('PBKS',(215,25,32)),('DC',(40,110,220)),('GT',(70,100,190)),('RR',(234,26,133)),('RCB',(212,18,26))]
def base(c1,c2):
    im=Image.new('RGB',(W,H),(10,12,20)); d=ImageDraw.Draw(im)
    for y in range(H):
        t=y/H; d.line([(0,y),(W,y)],fill=tuple(int(c1[i]*(1-t)*0.55+c2[i]*t*0.15+8) for i in range(3)))
    return im,d
def tag(d,text,col,x=50,y=50):
    f=font(46,800); w=d.textlength(text,font=f)+60
    d.rounded_rectangle([x,y,x+w,y+84],radius=14,fill=col)
    d.text((x+30,y+42),text,font=f,fill=(0,0,0),anchor='lm')
# 1 KAL RETENTION
im,d=base((200,30,30),(20,20,60)); Y=(255,214,0)
tag(d,'IPL 2027',Y)
stroke(d,(50,300),'कल रिटेंशन',font(230),(255,255,255),sw=10)
stroke(d,(50,500),'कौन बचेगा?',font(190),Y,sw=10)
d.text((50,660),'10 टीमों का पूरा हाल',font=font(54,800),fill=(255,255,255),anchor='lm')
im.save('pkg/thumb_1_kal_retention.png')
# 2 POORAN
im,d=base((0,168,224),(20,20,60)); R=(255,60,60)
tag(d,'बड़ा सवाल',(255,214,0))
stroke(d,(50,290),'पूरन',font(260),(255,255,255),sw=10)
stroke(d,(50,520),'₹21 करोड़?',font(185),(255,214,0),sw=10)
d.text((50,670),'IPL 2027 रिटेंशन से पहले',font=font(54,800),fill=(255,255,255),anchor='lm')
d.rounded_rectangle([900,60,1230,400],radius=30,fill=(0,0,0),outline=(255,255,255),width=6)
stroke(d,(1065,235),'?',font(320),(255,255,255),anchor='mm',sw=8)
im.save('pkg/thumb_2_pooran_21cr.png')
# 3 10 TEAMS
im,d=base((20,40,110),(10,10,30))
tag(d,'PREVIEW',(255,214,0))
stroke(d,(50,270),'10 टीमें',font(240),(255,255,255),sw=10)
stroke(d,(50,480),'10 फैसले',font(240),(255,214,0),sw=10)
x=50
for n,c in TEAMS:
    d.rounded_rectangle([x,590,x+112,680],radius=12,fill=c)
    d.text((x+56,635),n,font=font(36,900),fill=(0,0,0) if n=='CSK' else (255,255,255),anchor='mm'); x+=122
im.save('pkg/thumb_3_10teams.png')
