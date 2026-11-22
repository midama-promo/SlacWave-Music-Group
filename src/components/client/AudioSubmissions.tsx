import React, { useState } from 'react';
import { api } from '../../services/api';

const STORES = ['Spotify','Apple Music','Amazon Music','YouTube Music','Deezer','TIDAL','Boomplay','Audiomack','TikTok Music','Shazam','YouTube Content ID'];
const splitNames = (value:string) => value.split(',').map(v=>v.trim()).filter(Boolean);

export const AudioSubmissions: React.FC<{ onSubmitted?: () => void }> = ({ onSubmitted }) => {
  const [releaseType,setReleaseType]=useState<'Single'|'EP'|'Album'>('Single');
  const [title,setTitle]=useState(''); const [artists,setArtists]=useState(''); const [featured,setFeatured]=useState('');
  const [genre,setGenre]=useState(''); const [subGenre,setSubGenre]=useState(''); const [labelName,setLabelName]=useState('');
  const [version,setVersion]=useState('1.0'); const [language,setLanguage]=useState(''); const [lyricsLanguage,setLyricsLanguage]=useState('');
  const [releaseDate,setReleaseDate]=useState(''); const [composers,setComposers]=useState(''); const [producers,setProducers]=useState(''); const [publishers,setPublishers]=useState('');
  const [lyrics,setLyrics]=useState(''); const [previewStart,setPreviewStart]=useState(''); const [previouslyReleased,setPreviouslyReleased]=useState(false); const [previousDetails,setPreviousDetails]=useState(''); const [explicit,setExplicit]=useState(false);
  const [files,setFiles]=useState<File[]>([]); const [trackTitles,setTrackTitles]=useState(''); const [artwork,setArtwork]=useState<File|null>(null);
  const [dspSelections,setDspSelections]=useState<string[]>(['Spotify','Apple Music','YouTube Music']);
  const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [notice,setNotice]=useState('');
  const toggleStore=(name:string)=>setDspSelections(v=>v.includes(name)?v.filter(x=>x!==name):[...v,name]);
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setError('');setNotice('');
    if(!artwork) return setError('Upload your square JPG/PNG cover artwork.');
    if(!files.length) return setError('Choose at least one WAV or FLAC master.');
    if(releaseType==='Single'&&files.length!==1) return setError('A Single must contain exactly one audio file. Choose EP or Album for multiple tracks.');
    if(!artists.trim()||!genre.trim()||!title.trim()) return setError('Complete the release title, primary artist and genre.');
    const names=trackTitles.split('\n').map(v=>v.trim()).filter(Boolean);
    if(names.length&&names.length!==files.length) return setError('Enter one track title per audio file, or leave the track title box empty to use file names.');
    try{
      setBusy(true);
      const art=await api.uploadArtwork(artwork);
      const uploaded=[];
      for(let i=0;i<files.length;i++){
        const audio=await api.uploadAudio(files[i]);
        uploaded.push({id:`track-${Date.now()}-${i}`,title:names[i]||files[i].name.replace(/\.(wav|flac)$/i,''),filename:audio.filename,storedFilename:audio.storedFilename,fileUrl:audio.fileUrl,fileSize:audio.fileSize,version});
      }
      const result=await api.createRelease({
        title,releaseType,primaryArtists:splitNames(artists),featuredArtists:splitNames(featured),labelName,
        genre,subGenre,language,lyricsLanguage,version,lyrics,previewStart:previewStart?Number(previewStart):undefined,
        composers:splitNames(composers),producers:splitNames(producers),publishers:splitNames(publishers),targetReleaseDate:releaseDate,previouslyReleased,previousReleaseDetails:previousDetails,
        artworkUrl:art.fileUrl,artworkFilename:art.filename,storedArtworkFilename:art.storedFilename,artworkDimensions:art.dimensions,
        tracks:uploaded.map((t,i)=>({...t,trackNumber:i+1,explicit})),dspSelections,clientNotes:`Label: ${labelName||'SlacWave MG'}; Explicit: ${explicit?'Yes':'No'}`
      });
      setNotice(`Submitted successfully. Reference: ${result.release.refNumber}`);
      setTitle('');setArtists('');setFeatured('');setGenre('');setSubGenre('');setLabelName('');setVersion('1.0');setLanguage('');setLyricsLanguage('');setReleaseDate('');setComposers('');setProducers('');setPublishers('');setLyrics('');setPreviewStart('');setPreviouslyReleased(false);setPreviousDetails('');setExplicit(false);setFiles([]);setTrackTitles('');setArtwork(null);onSubmitted?.();
    }catch(err:any){setError(err?.message||'Could not submit this release.');}
    finally{setBusy(false);}
  };
  return <section className="mb-8 rounded-2xl border border-emerald-900/40 bg-neutral-900/70 p-5 sm:p-6">
    <div className="mb-5"><p className="text-[10px] font-black uppercase tracking-[.22em] text-emerald-400">Audio distribution</p><h2 className="mt-1 text-lg font-bold text-white">Create an audio release</h2><p className="mt-1 text-xs text-neutral-400">Submit a Single, EP or Album for SlacWave MG review and distribution.</p></div>
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <label className="text-xs text-neutral-300">Submission type *<select value={releaseType} onChange={e=>setReleaseType(e.target.value as any)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white"><option>Single</option><option>EP</option><option>Album</option></select></label>
      <label className="text-xs text-neutral-300">Release title *<input required value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="Official release title"/></label>
      <label className="text-xs text-neutral-300">Primary artist(s) *<input required value={artists} onChange={e=>setArtists(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="Separate multiple artists with commas"/></label>
      <label className="text-xs text-neutral-300">Featured artist(s)<input value={featured} onChange={e=>setFeatured(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="Optional"/></label>
      <label className="text-xs text-neutral-300">Genre *<input required value={genre} onChange={e=>setGenre(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="e.g. Amapiano"/></label>
      <label className="text-xs text-neutral-300">Sub-genre<input value={subGenre} onChange={e=>setSubGenre(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="Optional"/></label>
      <label className="text-xs text-neutral-300">Label (optional)<input value={labelName} onChange={e=>setLabelName(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="Your label name"/></label>
      <label className="text-xs text-neutral-300">Version<input value={version} onChange={e=>setVersion(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="1.0"/></label>
      <label className="text-xs text-neutral-300">Song language<input value={language} onChange={e=>setLanguage(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="e.g. isiZulu"/></label>
      <label className="text-xs text-neutral-300">Lyrics language<input value={lyricsLanguage} onChange={e=>setLyricsLanguage(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="If different"/></label>
      <label className="text-xs text-neutral-300">Target release date * (minimum 14 days ahead)<input required type="date" value={releaseDate} onChange={e=>setReleaseDate(e.target.value)} min={new Date(Date.now()+14*86400000).toISOString().slice(0,10)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white"/></label>
      <label className="text-xs text-neutral-300">Preview start (seconds, optional)<input type="number" min="0" value={previewStart} onChange={e=>setPreviewStart(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="e.g. 45"/></label>
      <label className="text-xs text-neutral-300">Composer(s)<input value={composers} onChange={e=>setComposers(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="Comma-separated names"/></label>
      <label className="text-xs text-neutral-300">Producer(s)<input value={producers} onChange={e=>setProducers(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="Comma-separated names"/></label>
      <label className="text-xs text-neutral-300">Publisher(s)<input value={publishers} onChange={e=>setPublishers(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="Optional, comma-separated names"/></label>
      <label className="text-xs text-neutral-300 sm:col-span-2">Cover artwork * (JPG/PNG, RGB, square, 1500×1500 minimum, 3000×3000 recommended)<input required type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={e=>setArtwork(e.target.files?.[0]||null)} className="mt-1 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-xs text-white file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-white"/></label>
      <label className="text-xs text-neutral-300 sm:col-span-2">Audio master(s) * (WAV or FLAC; 16/24-bit; 44.1–192 kHz; 32-bit not accepted)<input required multiple type="file" accept=".wav,.flac,audio/wav,audio/flac" onChange={e=>setFiles(Array.from(e.target.files||[]))} className="mt-1 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-xs text-white file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-white"/></label>
      {files.length>1&&<label className="text-xs text-neutral-300 sm:col-span-2">Track titles (one per line, same order as files)<textarea value={trackTitles} onChange={e=>setTrackTitles(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder={files.map(f=>f.name.replace(/\.(wav|flac)$/i,'')).join('\n')}/></label>}
      <label className="flex items-center gap-2 text-xs text-neutral-300"><input type="checkbox" checked={explicit} onChange={e=>setExplicit(e.target.checked)}/> Explicit content</label>
      <label className="flex items-center gap-2 text-xs text-neutral-300"><input type="checkbox" checked={previouslyReleased} onChange={e=>setPreviouslyReleased(e.target.checked)}/> Previously released</label>
      {previouslyReleased&&<label className="text-xs text-neutral-300 sm:col-span-2">Previous release details<textarea value={previousDetails} onChange={e=>setPreviousDetails(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white"/></label>}
      <label className="text-xs text-neutral-300 sm:col-span-2">Lyrics (optional)<textarea value={lyrics} onChange={e=>setLyrics(e.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white" placeholder="Enter complete lyrics for lyric platforms"/></label>
      <div className="sm:col-span-2"><p className="mb-2 text-xs font-semibold text-neutral-300">Select digital stores</p><div className="flex flex-wrap gap-2">{STORES.map(name=><label key={name} className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-300"><input type="checkbox" checked={dspSelections.includes(name)} onChange={()=>toggleStore(name)}/>{name}</label>)}</div></div>
      {error&&<p className="sm:col-span-2 text-xs text-red-400">{error}</p>}{notice&&<p className="sm:col-span-2 rounded-xl border border-emerald-800 bg-emerald-950/30 p-3 text-xs text-emerald-300">{notice}</p>}
      <div className="sm:col-span-2"><button disabled={busy} type="submit" className="rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white disabled:opacity-50">{busy?'Uploading and submitting…':'Submit Audio Release'}</button></div>
    </form>
  </section>;
};
