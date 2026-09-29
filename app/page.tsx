"use client";

import {useState} from "react";
import {ArrowRight, BookmarkCheck, Calculator, Check, ChevronDown, CircleAlert, FileText, Landmark, RefreshCw, Route, ShieldCheck} from "lucide-react";
import demo from "../data/demo.json";

type Scenario = (typeof demo.scenarios)[number];
type Brief = {
  standardPayment: number;
  incomePayment: number;
  monthlyChange: number;
  pressure: "low" | "watch" | "high";
  remainingPslfYears: number | null;
  nextSteps: string[];
};

function money(value:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value)}

function calculate(s:Scenario):Brief{
  const monthlyRate=s.rate/100/12;
  const standard=monthlyRate===0?s.balance/120:s.balance*monthlyRate*Math.pow(1+monthlyRate,120)/(Math.pow(1+monthlyRate,120)-1);
  const poverty=demo.povertyGuideline+Math.max(0,s.familySize-1)*5500;
  const discretionary=Math.max(0,s.agi-poverty*demo.incomeProtectionMultiplier);
  const incomePayment=discretionary*demo.incomeShare/12;
  const share=standard*12/Math.max(s.agi,1);
  return {
    standardPayment:standard,
    incomePayment,
    monthlyChange:standard-s.currentPayment,
    pressure:share>=.15?"high":share>=.08?"watch":"low",
    remainingPslfYears:s.publicService?Math.max(0,10-s.pslfYears):null,
    nextSteps:demo.steps[s.publicService?"publicService":"general"]
  };
}

export default function Home(){
  const [scenario,setScenario]=useState<Scenario>({...demo.scenarios[0]});
  const [brief,setBrief]=useState<Brief|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [saved,setSaved]=useState(false);
  const [showMath,setShowMath]=useState(false);

  function load(id:string){
    const found=demo.scenarios.find(item=>item.id===id)!;
    setScenario({...found}); setBrief(null); setError(""); setSaved(false); setShowMath(false);
  }
  function update<K extends keyof Scenario>(key:K,value:Scenario[K]){
    setScenario(current=>({...current,[key]:value})); setBrief(null); setSaved(false); setError("");
  }
  function generate(){
    if(!scenario.name.trim()){setError("Add a first name or label for this brief.");return}
    if(scenario.agi<0||scenario.familySize<1||scenario.balance<=0||scenario.rate<0||scenario.rate>25||scenario.currentPayment<0){setError("Check the highlighted numbers. Balance and family size must be positive; rate must be between 0% and 25%.");return}
    setError("");setBusy(true);setBrief(null);setSaved(false);
    window.setTimeout(()=>{setBrief(calculate(scenario));setBusy(false)},650);
  }
  function reset(){load("maya")}

  return <main>
    <header className="topbar"><a className="brand" href="#top"><span><Route/></span>RepayRoute</a><span className="demo-chip">Educational demo · no account</span></header>
    <section className="hero" id="top">
      <div><p className="eyebrow">NOTICE → NUMBERS → NEXT STEPS</p><h1>Your loan notice is confusing.<br/><em>Your next move shouldn&apos;t be.</em></h1><p className="lede">Turn a possible payment change into an illustrative comparison, a documentation checklist, and better questions for your servicer.</p></div>
      <div className="hero-note"><CircleAlert/><div><b>Not financial or legal advice</b><span>No enrollment occurs. Rules and estimates change; verify every option with StudentAid.gov and your servicer.</span></div></div>
    </section>
    <nav className="steps" aria-label="Workflow steps"><span className="current">1 <b>Tell us the basics</b></span><span>2 <b>See the pressure</b></span><span>3 <b>Prepare your call</b></span></nav>

    <div className="workspace">
      <section className="intake" aria-labelledby="intake-title">
        <div className="section-head"><div><p>STEP 01</p><h2 id="intake-title">Build a private estimate</h2></div><button className="icon-button" onClick={reset} aria-label="Reset to demo borrower"><RefreshCw/></button></div>
        <div className="scenario-row"><span>Try a fictional profile</span><div>{demo.scenarios.map(item=><button key={item.id} onClick={()=>load(item.id)} className={scenario.id===item.id?"selected":""}>{item.name}</button>)}</div></div>
        <div className="form-grid">
          <label>Brief label<input aria-label="Brief label" value={scenario.name} onChange={e=>update("name",e.target.value)} maxLength={32}/></label>
          <label>Adjusted gross income<span className="money-input"><i>$</i><input aria-label="Adjusted gross income" type="number" value={scenario.agi} min="0" onChange={e=>update("agi",Number(e.target.value))}/></span></label>
          <label>Federal loan balance<span className="money-input"><i>$</i><input aria-label="Federal loan balance" type="number" value={scenario.balance} min="1" onChange={e=>update("balance",Number(e.target.value))}/></span></label>
          <label>Weighted interest rate<span className="money-input suffix"><input aria-label="Weighted interest rate" type="number" step="0.1" value={scenario.rate} min="0" max="25" onChange={e=>update("rate",Number(e.target.value))}/><i>%</i></span></label>
          <label>Current monthly payment<span className="money-input"><i>$</i><input aria-label="Current monthly payment" type="number" value={scenario.currentPayment} min="0" onChange={e=>update("currentPayment",Number(e.target.value))}/></span></label>
          <label>Family size<input aria-label="Family size" type="number" value={scenario.familySize} min="1" max="20" onChange={e=>update("familySize",Number(e.target.value))}/></label>
        </div>
        <label className="check-row"><input type="checkbox" checked={scenario.publicService} onChange={e=>update("publicService",e.target.checked)}/><span><b>I work for a government or qualifying nonprofit employer</b><small>This flags a PSLF verification step; it does not determine eligibility.</small></span></label>
        {scenario.publicService&&<label className="years">Years of qualifying PSLF payments<input aria-label="Years of qualifying PSLF payments" type="number" min="0" max="10" value={scenario.pslfYears} onChange={e=>update("pslfYears",Number(e.target.value))}/></label>}
        <button className="primary" onClick={generate} disabled={busy}>{busy?"Calculating illustrative paths…":"Generate my route brief"}<ArrowRight/></button>
        {error&&<p className="error" role="alert"><CircleAlert/>{error}</p>}
        <p className="privacy"><ShieldCheck/>Demo inputs stay in this browser session and are not submitted.</p>
      </section>

      <section className="output" aria-live="polite" aria-busy={busy}>
        {!brief?<div className="empty"><div><Calculator/></div><h2>{busy?"Building the brief…":"Your comparison will appear here"}</h2><p>Use the fictional defaults or edit the numbers, then generate a route brief.</p></div>:<>
          <div className="section-head"><div><p>STEP 02 · {scenario.name.toUpperCase()}&apos;S BRIEF</p><h2>Prepare for a possible payment jump</h2></div><span className={`pressure ${brief.pressure}`}>{brief.pressure} pressure</span></div>
          <div className="delta"><span>Illustrative 10-year payment</span><strong>{money(brief.standardPayment)}<small>/mo</small></strong><p>{brief.monthlyChange>=0?`${money(brief.monthlyChange)} more`:`${money(Math.abs(brief.monthlyChange))} less`} than the entered current payment</p></div>
          <div className="comparison"><article><span>Current payment</span><b>{money(scenario.currentPayment)}</b><small>entered by you</small></article><article><span>Income-linked illustration</span><b>{money(brief.incomePayment)}</b><small>not a plan quote</small></article>{brief.remainingPslfYears!==null&&<article><span>PSLF runway</span><b>{brief.remainingPslfYears} yrs</b><small>verify qualifying count</small></article>}</div>
          <button className="math-toggle" onClick={()=>setShowMath(value=>!value)} aria-expanded={showMath}>How the estimate works <ChevronDown className={showMath?"open":""}/></button>
          {showMath&&<div className="method"><p>The standard estimate amortizes the entered balance and rate over 120 months. The income illustration uses 10% of income above 225% of a simplified poverty guideline. It is deliberately labeled as an illustration because federal rules, eligibility, and plan availability can change.</p></div>}
          <div className="checklist"><p>STEP 03 · PREPARE YOUR CALL</p>{brief.nextSteps.map((step,index)=><div key={step}><span>{index+1}</span><b>{step}</b></div>)}</div>
          <button className={`save ${saved?"saved":""}`} onClick={()=>setSaved(true)}><BookmarkCheck/>{saved?"Brief saved for this session":"Save this demo brief"}</button>
          <p className="disclaimer">{demo.disclaimer}</p>
        </>}
      </section>
    </div>
    <section className="trust-strip"><div><Landmark/><span><b>Official source first</b><small>Confirm on StudentAid.gov</small></span></div><div><FileText/><span><b>Get it in writing</b><small>Save notices and confirmation numbers</small></span></div><div><Check/><span><b>Human-reviewed next</b><small>A counselor or servicer confirms options</small></span></div></section>
    <footer><span>RepayRoute · Fictional prototype, September 2026</span><a href="https://www.ideabrowser.com/hub/ideas/student-loan-plan-picker-for-borrowers-kicked-off-save-7306dde7">Public source idea ↗</a></footer>
  </main>;
}
