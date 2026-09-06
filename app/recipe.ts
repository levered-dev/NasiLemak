export const ingredients=[
{id:'beras',name:'Beras',amount:'2 cawan',color:'#eee5c6'},
{id:'santan',name:'Santan',amount:'1 cawan',color:'#fffaf0'},
{id:'air',name:'Air',amount:'Secukupnya',color:'#77cfe2'},
{id:'pandan',name:'Daun pandan',amount:'2 helai',color:'#559938'},
{id:'garam',name:'Garam',amount:'Secukup rasa',color:'#ececf3'},
{id:'bawang',name:'Bawang kisar',amount:'3 biji',color:'#cd90aa'},
{id:'cili',name:'Cili kisar',amount:'4 sudu besar',color:'#d74d30'},
{id:'minyak',name:'Minyak',amount:'3 sudu besar',color:'#e7b23d'},
{id:'asam',name:'Air asam jawa',amount:'2 sudu besar',color:'#9a5333'},
{id:'gula',name:'Gula',amount:'1 sudu kecil',color:'#dbb58d'},
{id:'bilis',name:'Ikan bilis',amount:'½ cawan',color:'#bd9563'},
{id:'kacang',name:'Kacang tanah',amount:'½ cawan',color:'#bd733e'},
{id:'telur',name:'Telur',amount:'2 biji',color:'#e6b989'},
{id:'timun',name:'Timun',amount:'½ batang',color:'#73a948'}];

export const dishes=[
{id:'nasi',name:'Nasi santan',amount:'Wangi daun pandan',color:'#eee5c6'},
{id:'sambal',name:'Sambal',amount:'Dimasak hingga pecah minyak',color:'#b6331e'},
{id:'bilis',name:'Ikan bilis goreng',amount:'Rangup & keemasan',color:'#bd9563'},
{id:'kacang',name:'Kacang goreng',amount:'Ditiriskan',color:'#bd733e'},
{id:'telur',name:'Telur rebus',amount:'Dikupas & dibelah',color:'#efbd32'},
{id:'timun',name:'Hirisan timun',amount:'Segar & rangup',color:'#73a948'}];
export const stages=[
{title:'Susun ruang dapur',short:'Susun',text:'Alihkan sekurang-kurangnya 3 bahan ke tempat pilihan anda. Seret mangkuk atau gunakan butang arah di bawah.',tip:'Semua bahan boleh disusun semula pada bila-bila masa sebelum menghidang.',needs:[] as string[],action:'Mula memasak',duration:0},
{title:'Masak nasi santan',short:'Nasi',text:'Bilas beras dahulu. Masukkan beras, santan, air, daun pandan dan garam ke dalam periuk.',tip:'Gunakan 2 cawan beras, 1 cawan santan dan air mengikut sukatan periuk nasi. Masak hingga nasi tanak.',needs:['beras','santan','air','pandan','garam'],action:'Masak nasi',duration:7},
{title:'Tumis sambal',short:'Sambal',text:'Masukkan minyak, bawang dan cili kisar. Tambah air asam jawa, gula dan garam. Kacau 3 kali sebelum memasak.',tip:'Tumis bawang dan cili hingga pecah minyak sebelum menambah air asam, gula dan garam. Kecilkan api supaya tidak hangus.',needs:['minyak','bawang','cili','asam','gula','garam'],action:'Tumis hingga pecah minyak',duration:7},
{title:'Goreng lauk rangup',short:'Lauk',text:'Sediakan minyak, ikan bilis dan kacang. Goreng ikan bilis dan kacang secara berasingan, kemudian tiriskan.',tip:'Gunakan ikan bilis yang telah dibersihkan dan dikeringkan. Angkat apabila keemasan.',needs:['minyak','bilis','kacang'],action:'Goreng secara berasingan',duration:6},
{title:'Rebus telur',short:'Telur',text:'Masukkan telur dan air ke dalam periuk. Rebus sehingga masak, kemudian sejukkan, kupas dan belah.',tip:'Dalam dapur sebenar, telur rebus keras biasanya mengambil sekitar 10–12 minit selepas air mendidih.',needs:['telur','air'],action:'Rebus telur',duration:5},
{title:'Sediakan timun',short:'Timun',text:'Pilih timun dan bawa ke papan pemotong. Basuh timun, kemudian potong 4 kali untuk menghasilkan hirisan.',tip:'Hirisan timun segar melengkapkan nasi santan dan sambal.',needs:['timun'],action:'Potong timun',duration:0},
{title:'Hias hidangan anda',short:'Hidang',text:'Pilih setiap lauk, kemudian letakkan di pinggan. Seret atau putar lauk untuk menyusun hidangan mengikut kreativiti anda.',tip:'Pastikan keenam-enam komponen ada: nasi, sambal, ikan bilis, kacang, telur dan timun.',needs:[] as string[],action:'Hidangkan nasi lemak',duration:0},
{title:'Nasi lemak siap!',short:'Siap',text:'Tahniah, anda sudah menyediakan nasi lemak lengkap. Putar kamera untuk melihat hasil susunan anda.',tip:'Selamat menjamu selera!',needs:[] as string[],action:'Main sekali lagi',duration:0}];
export type GameState={stage:number;moved:string[];added:string[];washed:boolean;stirs:number;slices:number;running:boolean;progress:number;complete:boolean;plated:string[]};
export type Action={type:'move';id:string}|{type:'add';id:string}|{type:'wash'}|{type:'stir'}|{type:'slice'}|{type:'cook'}|{type:'tick';seconds:number}|{type:'next'}|{type:'plate';id:string}|{type:'reset'};
export const initialState=():GameState=>({stage:0,moved:[],added:[],washed:false,stirs:0,slices:0,running:false,progress:0,complete:false,plated:[]});
export function transition(s:GameState,a:Action):{state:GameState;message:string}{
const unchanged=(message:string)=>({state:s,message});const ok=(patch:Partial<GameState>,message='')=>({state:{...s,...patch},message});const step=stages[s.stage];
if(a.type==='reset')return {state:initialState(),message:'Dapur sudah disediakan semula.'};
if(a.type==='move')return s.stage>=6?(dishes.some(i=>i.id===a.id)?unchanged('Susunan lauk dikemas kini.'):unchanged('Lauk tidak dikenali.')):ingredients.some(i=>i.id===a.id)?ok({moved:[...new Set([...s.moved,a.id])]}):unchanged('Bahan tidak dikenali.');
if(a.type==='add'){
if(s.running||s.complete)return unchanged('Langkah ini sedang dimasak atau sudah siap.');
if(!step.needs.includes(a.id))return unchanged('Bahan ini tidak diperlukan untuk langkah semasa.');
if(s.added.includes(a.id))return unchanged('Bahan ini sudah dimasukkan.');
if(s.stage===1&&!s.washed)return unchanged('Bilas beras dahulu sebelum menambah bahan ke periuk.');
return ok({added:[...s.added,a.id]},`${ingredients.find(i=>i.id===a.id)!.name} sudah disediakan.`);
}
if(a.type==='wash'){
if(s.stage===1&&!s.washed)return ok({washed:true},'Beras sudah dibilas dan ditoskan.');
if(s.stage===5&&s.added.includes('timun')&&!s.washed)return ok({washed:true},'Timun sudah dibasuh. Sedia untuk dipotong.');
return unchanged('Tiada bahan untuk dibasuh sekarang.');
}
if(a.type==='stir')return s.stage===2&&s.added.length===step.needs.length&&!s.running&&!s.complete?ok({stirs:Math.min(3,s.stirs+1)},'Kacau sambal perlahan-lahan.'):unchanged('Sediakan semua bahan sambal dahulu.');
if(a.type==='slice')return s.stage===5&&s.washed&&s.slices<4?ok({slices:s.slices+1,complete:s.slices+1===4},s.slices===3?'Timun siap dihiris!':'Satu hirisan timun sudah dipotong.'):unchanged('Sediakan dan basuh timun dahulu.');
if(a.type==='cook'){
if(!step.duration||s.running||s.complete)return unchanged('Belum boleh memasak pada langkah ini.');
if(step.needs.some(id=>!s.added.includes(id)))return unchanged('Lengkapkan bahan dalam senarai dahulu.');
if(s.stage===2&&s.stirs<3)return unchanged('Kacau sambal 3 kali dahulu.');
return ok({running:true,progress:0},'Sedang memasak… Masa dipercepat untuk permainan.');
}
if(a.type==='tick'){
if(!s.running||!Number.isFinite(a.seconds)||a.seconds<=0)return unchanged('');
const progress=Math.min(1,s.progress+a.seconds/step.duration);return ok({progress,running:progress<1,complete:progress===1},progress===1?'Siap! Teruskan ke langkah seterusnya.':'');
}
if(a.type==='plate'){
if(s.stage!==6||!dishes.some(i=>i.id===a.id))return unchanged('Lauk ini belum boleh dihidangkan.');
if(s.plated.includes(a.id))return unchanged('Lauk ini sudah di pinggan. Anda boleh mengalihkannya.');
return ok({plated:[...s.plated,a.id]},'Lauk diletakkan. Seret untuk menyusun kedudukannya.');
}
if(a.type==='next'){
if(s.stage===0&&s.moved.length<3)return unchanged('Alihkan sekurang-kurangnya 3 bahan dahulu.');
if(s.stage>0&&s.stage<6&&!s.complete)return unchanged('Selesaikan langkah ini dahulu.');
if(s.stage===6&&s.plated.length!==dishes.length)return unchanged('Letakkan keenam-enam komponen di pinggan dahulu.');
if(s.stage===7)return unchanged('Hidangan sudah siap.');
return ok({stage:s.stage+1,added:[],washed:false,stirs:0,slices:0,complete:false,running:false,progress:0},s.stage===6?'Tahniah! Nasi lemak anda sudah siap.':'');
}
return unchanged('Tindakan tidak dikenali.');
}
