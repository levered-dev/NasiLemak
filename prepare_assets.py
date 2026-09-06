import pathlib,json,shutil
root=pathlib.Path(__file__).parent
source=root.parent/'output/nasi-lemak-3d'
out=root/'public';out.mkdir(exist_ok=True)
vertices=[];materials={};name='';mat='';groups={k:[] for k in ['nasi','sambal','bilis','kacang','telur','timun']}
for line in (source/'nasi_lemak.mtl').read_text().splitlines():
    if line.startswith('newmtl '):mat=line.split()[1]
    if line.startswith('Kd '):materials[mat]=[float(x) for x in line.split()[1:]]
def category(name):
    if name.startswith(('Nasi','Butir')):return 'nasi'
    if name.startswith(('Sambal','Tekstur')):return 'sambal'
    if name.startswith(('Ikan','Ekor','Mata')):return 'bilis'
    if name.startswith('Kacang'):return 'kacang'
    if name.startswith(('Telur','Kuning')):return 'telur'
    if name.startswith(('Timun','Biji')):return 'timun'
for line in (source/'nasi_lemak.obj').read_text().splitlines():
    if line.startswith('v '):
        x,y,z=map(float,line.split()[1:]);vertices.append([x*.43,z*.43,-y*.43])
    elif line.startswith('o '):name=line[2:]
    elif line.startswith('usemtl '):mat=line.split()[1]
    elif line.startswith('f ') and category(name):
        for token in line.split()[1:]:groups[category(name)].append((vertices[int(token.split('/')[0])-1],materials[mat]))
data={}
for key,items in groups.items():
    xs=[v[0] for v,c in items];ys=[v[1] for v,c in items];zs=[v[2] for v,c in items]
    cx=(min(xs)+max(xs))/2;cy=min(ys);cz=(min(zs)+max(zs))/2
    data[key]={'p':[round(x,5) for v,c in items for x in (v[0]-cx,v[1]-cy,v[2]-cz)],'c':[round(x,4) for v,c in items for x in c],'home':[round(cx,5),round(cy,5),round(cz,5)]}
(out/'hidangan.json').write_text(json.dumps(data,separators=(',',':')))
shutil.copyfile(source/'pratonton.png',out/'nasi-lemak.png')
print('Prepared',len(data),'dish groups;',sum(len(v['p'])//9 for v in data.values()),'triangles')
