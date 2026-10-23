// 통합차트 에러 체크: JS 문법 + 자보/건보(라이트·다크) 렌더링
// 사용: node tools/check.cjs [html경로]   (기본: index.html)
const fs=require('fs');
const path=require('path');
const {execSync}=require('child_process');

const file=path.resolve(process.argv[2]||path.join(__dirname,'..','index.html'));
const html=fs.readFileSync(file,'utf8');
const fails=[];

// 1. JS 문법
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
scripts.forEach((m,i)=>{
  const line=html.slice(0,m.index).split('\n').length;
  try{ new Function(m[1]); }
  catch(e){ fails.push(`[문법] script #${i+1} (${line}행부터): ${e.message}`); }
});

// 2. 렌더링
let chromium;
try{ ({chromium}=require('playwright')); }
catch{ ({chromium}=require(path.join(execSync('npm root -g').toString().trim(),'playwright'))); }

(async()=>{
  const browser=await chromium.launch();
  const page=await browser.newPage();
  page.on('pageerror',e=>fails.push(`[런타임] ${e.message}`));
  page.on('console',m=>{
    if(m.type()==='error'&&!/fonts\.(googleapis|gstatic)/.test(m.text()+(m.location().url||'')))
      fails.push(`[콘솔] ${m.text()}`);
  });
  await page.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
  await page.goto('file://'+file);
  await page.fill('#patientName','테스트');

  const placeholder='이름과 정보를 입력하면';
  for(const dark of [false,true]){
    for(const mode of ['ta','gb']){
      const label=`${mode==='ta'?'자보':'건보'}·${dark?'다크':'라이트'}`;
      try{
        const out=await page.evaluate(([mode,dark])=>{
          document.body.classList.toggle('dark-mode',dark);
          setChartMode(mode);
          render();
          return document.getElementById('outputText').innerText;
        },[mode,dark]);
        if(!out.trim()||out.includes(placeholder)) fails.push(`[렌더링] ${label}: 출력이 비어 있음`);
        else console.log(`OK  ${label} (${out.length}자)`);
      }catch(e){ fails.push(`[렌더링] ${label}: ${e.message.split('\n')[0]}`); }
    }
  }
  await browser.close();

  if(fails.length){ console.log('\n실패 '+fails.length+'건'); fails.forEach(f=>console.log('- '+f)); process.exit(1); }
  console.log(`\n통과: 문법(script ${scripts.length}개), 자보/건보 × 라이트/다크 렌더링`);
})().catch(e=>{ console.error(e); process.exit(1); });
