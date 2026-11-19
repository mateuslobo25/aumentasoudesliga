const DB_NAME='aod_media_db';
const STORE_NAME='files';

function openDb(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){reject(new Error('IndexedDB indisponível'));return}
    const request=indexedDB.open(DB_NAME,2);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORE_NAME))db.createObjectStore(STORE_NAME);
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('Não foi possível abrir o armazenamento'));
  });
}

export async function saveMedia(file){
  if(!(file instanceof File)||!file.size)throw new Error('Ficheiro vazio');
  const buffer=await file.arrayBuffer();
  const key=`media_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const db=await openDb();
  try{
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE_NAME,'readwrite');
      const request=tx.objectStore(STORE_NAME).put({buffer,name:file.name||'audio-upload',type:file.type||'application/octet-stream',size:file.size},key);
      request.onerror=()=>reject(request.error||new Error('Não foi possível guardar o ficheiro'));
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error||new Error('Não foi possível guardar o ficheiro'));
      tx.onabort=()=>reject(tx.error||new Error('O armazenamento foi interrompido'));
    });
    return key;
  }finally{db.close()}
}

export async function loadMedia(key){
  if(!key)return null;
  const db=await openDb();
  let value;
  try{
    value=await new Promise((resolve,reject)=>{
      const request=db.transaction(STORE_NAME,'readonly').objectStore(STORE_NAME).get(key);
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||new Error('Não foi possível ler o ficheiro'));
    });
  }finally{db.close()}
  if(!value)return null;
  if(value.buffer){return {...value,blob:new Blob([value.buffer],{type:value.type||'application/octet-stream'})};}
  if(value.blob)return value;
  if(value instanceof Blob)return {blob:value,name:value.name||'audio-upload',type:value.type||'application/octet-stream'};
  return null;
}

export async function clearMedia(){
  if(!('indexedDB' in window)) return;
  await new Promise((resolve,reject)=>{
    const request=indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess=()=>resolve();
    request.onerror=()=>reject(request.error||new Error('Não foi possível limpar os ficheiros locais'));
    request.onblocked=()=>resolve();
  });
}
