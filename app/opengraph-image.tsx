import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'FINIDY Research Center — Sciences humaines et sociales à Madagascar'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'72px 82px', background:'linear-gradient(135deg, #FEFAF3 0%, #FBF0D0 55%, #F5EDD8 100%)', color:'#3D2008' }}>
      <div style={{ display:'flex', alignItems:'center', gap:18, fontSize:26, letterSpacing:2, textTransform:'uppercase', color:'#7A4A10' }}><span style={{ width:52, height:6, background:'#E8A020', borderRadius:6 }} />Sciences humaines & sociales · Madagascar</div>
      <div style={{ display:'flex', flexDirection:'column' }}><div style={{ display:'flex', fontFamily:'serif', fontWeight:700, fontSize:76, letterSpacing:-3 }}>FINIDY <span style={{ color:'#E8A020', marginLeft:18 }}>Research Center</span></div><div style={{ marginTop:24, maxWidth:940, fontFamily:'serif', fontSize:38, lineHeight:1.25 }}>La recherche malgache publiée, partagée et mise en action.</div></div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:23, color:'#5C3A1E' }}><span>Revue SAONTSY · Magazine · Consultance · Éditions</span><span style={{ fontWeight:700 }}>finidy.mg</span></div>
    </div>, size,
  )
}
