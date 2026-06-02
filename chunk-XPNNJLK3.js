import{a as Ht}from"./chunk-SWBPXTPD.js";import{c as jt}from"./chunk-LIW5Z6CG.js";import{a as Vt,b as X,c as qt,d as Gt,f as Ut,g as $t,h as Wt,l as Yt,n as Zt}from"./chunk-QYTHFP36.js";import"./chunk-7DJ5F2LS.js";import{$a as St,Ab as Ot,B as gt,Ba as D,Bb as Rt,C as vt,Ca as u,D as xt,Da as F,Eb as zt,F as q,Fa as A,K as _,Ka as N,Kb as Pt,L as f,La as g,Lb as Lt,Ma as v,N as C,Na as w,Oa as r,P as l,Pa as d,Pb as Nt,Qa as p,Ra as W,Sa as Y,Ta as Z,Tb as Bt,Va as et,W as P,Wa as O,X as G,Ya as I,Z as _t,Za as B,_a as y,aa as yt,ab as nt,ba as S,bb as b,c as ut,cb as h,db as Dt,e as pt,ea as U,eb as It,f as z,fa as wt,fb as at,gb as it,hb as M,ia as L,ib as m,jb as Tt,ka as Mt,ma as Ct,n as bt,na as Ft,oa as Et,pb as Q,qa as c,t as ht,u as V,ub as At,wa as kt,xa as $,xb as K,zb as j}from"./chunk-3MS4ZW6V.js";var ke=new C("cdk-dir-doc",{providedIn:"root",factory:()=>l(_t)}),Se=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function Qt(e){let i=e?.toLowerCase()||"";return i==="auto"&&typeof navigator<"u"&&navigator?.language?Se.test(navigator.language)?"rtl":"ltr":i==="rtl"?"rtl":"ltr"}var ot=(()=>{class e{get value(){return this.valueSignal()}valueSignal=U("ltr");change=new yt;constructor(){let t=l(ke,{optional:!0});if(t){let n=t.body?t.body.dir:null,a=t.documentElement?t.documentElement.dir:null;this.valueSignal.set(Qt(n||a||"ltr"))}}ngOnDestroy(){this.change.complete()}static \u0275fac=function(n){return new(n||e)};static \u0275prov=_({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var E=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=f({})}return e})();var Kt=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=f({imports:[E]})}return e})();function Xt(e){return e!=null&&`${e}`!="false"}var rt;try{rt=typeof Intl<"u"&&Intl.v8BreakIterator}catch{rt=!1}var H=(()=>{class e{_platformId=l(Ct);isBrowser=this._platformId?Bt(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||rt)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;constructor(){}static \u0275fac=function(n){return new(n||e)};static \u0275prov=_({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var Jt=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=f({})}return e})();var te=new Set,T,dt=(()=>{class e{_platform=l(H);_nonce=l(Et,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):Ie}matchMedia(t){return(this._platform.WEBKIT||this._platform.BLINK)&&De(t,this._nonce),this._matchMedia(t)}static \u0275fac=function(n){return new(n||e)};static \u0275prov=_({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();function De(e,i){if(!te.has(e))try{T||(T=document.createElement("style"),i&&T.setAttribute("nonce",i),T.setAttribute("type","text/css"),document.head.appendChild(T)),T.sheet&&(T.sheet.insertRule(`@media ${e} {body{ }}`,0),te.add(e))}catch(t){console.error(t)}}function Ie(e){return{matches:e==="all"||e==="",media:e,addListener:()=>{},removeListener:()=>{}}}var Te=(()=>{class e{create(t){return typeof MutationObserver>"u"?null:new MutationObserver(t)}static \u0275fac=function(n){return new(n||e)};static \u0275prov=_({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var ee=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=f({providers:[Te]})}return e})();var lt={},R=class e{_appId=l(Mt);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(i,t=!1){return this._appId!=="ng"&&(i+=this._appId),lt.hasOwnProperty(i)||(lt[i]=0),`${i}${t?e._infix+"-":""}${lt[i]++}`}static \u0275fac=function(t){return new(t||e)};static \u0275prov=_({token:e,factory:e.\u0275fac,providedIn:"root"})};var st=class{_box;_destroyed=new z;_resizeSubject=new z;_resizeObserver;_elementObservables=new Map;constructor(i){this._box=i,typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(t=>this._resizeSubject.next(t)))}observe(i){return this._elementObservables.has(i)||this._elementObservables.set(i,new pt(t=>{let n=this._resizeSubject.subscribe(t);return this._resizeObserver?.observe(i,{box:this._box}),()=>{this._resizeObserver?.unobserve(i),n.unsubscribe(),this._elementObservables.delete(i)}}).pipe(V(t=>t.some(n=>n.target===i)),vt({bufferSize:1,refCount:!0}),q(this._destroyed))),this._elementObservables.get(i)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear()}},ne=(()=>{class e{_cleanupErrorListener;_observers=new Map;_ngZone=l(S);constructor(){typeof ResizeObserver<"u"}ngOnDestroy(){for(let[,t]of this._observers)t.destroy();this._observers.clear(),this._cleanupErrorListener?.()}observe(t,n){let a=n?.box||"content-box";return this._observers.has(a)||this._observers.set(a,new st(a)),this._observers.get(a).observe(t)}static \u0275fac=function(n){return new(n||e)};static \u0275prov=_({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var Ae=new C("MATERIAL_ANIMATIONS"),ae=null;function Oe(){return l(Ae,{optional:!0})?.animationsDisabled||l(Ft,{optional:!0})==="NoopAnimations"?"di-disabled":(ae??=l(dt).matchMedia("(prefers-reduced-motion)").matches,ae?"reduced-motion":"enabled")}function ie(){return Oe()!=="enabled"}var Re=["notch"],ze=["matFormFieldNotchedOutline",""],Pe=["*"],oe=["iconPrefixContainer"],re=["textPrefixContainer"],de=["iconSuffixContainer"],le=["textSuffixContainer"],Le=["textField"],Ne=["*",[["mat-label"]],[["","matPrefix",""],["","matIconPrefix",""]],[["","matTextPrefix",""]],[["","matTextSuffix",""]],[["","matSuffix",""],["","matIconSuffix",""]],[["mat-error"],["","matError",""]],[["mat-hint",3,"align","end"]],[["mat-hint","align","end"]]],Be=["*","mat-label","[matPrefix], [matIconPrefix]","[matTextPrefix]","[matTextSuffix]","[matSuffix], [matIconSuffix]","mat-error, [matError]","mat-hint:not([align='end'])","mat-hint[align='end']"];function je(e,i){e&1&&p(0,"span",21)}function He(e,i){if(e&1&&(r(0,"label",20),y(1,1),g(2,je,1,0,"span",21),d()),e&2){let t=I(2);w("floating",t._shouldLabelFloat())("monitorResize",t._hasOutline())("id",t._labelId),N("for",t._control.disableAutomaticLabeling?null:t._control.id),c(2),v(!t.hideRequiredMarker&&t._control.required?2:-1)}}function Ve(e,i){if(e&1&&g(0,He,3,5,"label",20),e&2){let t=I();v(t._hasFloatingLabel()?0:-1)}}function qe(e,i){e&1&&p(0,"div",7)}function Ge(e,i){}function Ue(e,i){if(e&1&&A(0,Ge,0,0,"ng-template",13),e&2){I(2);let t=it(1);w("ngTemplateOutlet",t)}}function $e(e,i){if(e&1&&(r(0,"div",9),g(1,Ue,1,1,null,13),d()),e&2){let t=I();w("matFormFieldNotchedOutlineOpen",t._shouldLabelFloat()),c(),v(t._forceDisplayInfixLabel()?-1:1)}}function We(e,i){e&1&&(r(0,"div",10,2),y(2,2),d())}function Ye(e,i){e&1&&(r(0,"div",11,3),y(2,3),d())}function Ze(e,i){}function Qe(e,i){if(e&1&&A(0,Ze,0,0,"ng-template",13),e&2){I();let t=it(1);w("ngTemplateOutlet",t)}}function Ke(e,i){e&1&&(r(0,"div",14,4),y(2,4),d())}function Xe(e,i){e&1&&(r(0,"div",15,5),y(2,5),d())}function Je(e,i){e&1&&p(0,"div",16)}function tn(e,i){e&1&&(r(0,"div",18),y(1,6),d())}function en(e,i){if(e&1&&(r(0,"mat-hint",22),m(1),d()),e&2){let t=I(2);w("id",t._hintLabelId),c(),Tt(t.hintLabel)}}function nn(e,i){if(e&1&&(r(0,"div",19),g(1,en,2,2,"mat-hint",22),y(2,7),p(3,"div",23),y(4,8),d()),e&2){let t=I();c(),v(t.hintLabel?1:-1)}}var ct=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275dir=F({type:e,selectors:[["mat-label"]]})}return e})(),an=new C("MatError");var mt=(()=>{class e{align="start";id=l(R).getId("mat-mdc-hint-");static \u0275fac=function(n){return new(n||e)};static \u0275dir=F({type:e,selectors:[["mat-hint"]],hostAttrs:[1,"mat-mdc-form-field-hint","mat-mdc-form-field-bottom-align"],hostVars:4,hostBindings:function(n,a){n&2&&(et("id",a.id),N("align",null),M("mat-mdc-form-field-hint-end",a.align==="end"))},inputs:{align:"align",id:"id"}})}return e})(),on=new C("MatPrefix");var rn=new C("MatSuffix");var be=new C("FloatingLabelParent"),se=(()=>{class e{_elementRef=l(L);get floating(){return this._floating}set floating(t){this._floating=t,this.monitorResize&&this._handleResize()}_floating=!1;get monitorResize(){return this._monitorResize}set monitorResize(t){this._monitorResize=t,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe()}_monitorResize=!1;_resizeObserver=l(ne);_ngZone=l(S);_parent=l(be);_resizeSubscription=new ut;constructor(){}ngOnDestroy(){this._resizeSubscription.unsubscribe()}getWidth(){return dn(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized())}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:"border-box"}).subscribe(()=>this._handleResize())})}static \u0275fac=function(n){return new(n||e)};static \u0275dir=F({type:e,selectors:[["label","matFormFieldFloatingLabel",""]],hostAttrs:[1,"mdc-floating-label","mat-mdc-floating-label"],hostVars:2,hostBindings:function(n,a){n&2&&M("mdc-floating-label--float-above",a.floating)},inputs:{floating:"floating",monitorResize:"monitorResize"}})}return e})();function dn(e){let i=e;if(i.offsetParent!==null)return i.scrollWidth;let t=i.cloneNode(!0);t.style.setProperty("position","absolute"),t.style.setProperty("transform","translate(-9999px, -9999px)"),document.documentElement.appendChild(t);let n=t.scrollWidth;return t.remove(),n}var ce="mdc-line-ripple--active",J="mdc-line-ripple--deactivating",me=(()=>{class e{_elementRef=l(L);_cleanupTransitionEnd;constructor(){let t=l(S),n=l(kt);t.runOutsideAngular(()=>{this._cleanupTransitionEnd=n.listen(this._elementRef.nativeElement,"transitionend",this._handleTransitionEnd)})}activate(){let t=this._elementRef.nativeElement.classList;t.remove(J),t.add(ce)}deactivate(){this._elementRef.nativeElement.classList.add(J)}_handleTransitionEnd=t=>{let n=this._elementRef.nativeElement.classList,a=n.contains(J);t.propertyName==="opacity"&&a&&n.remove(ce,J)};ngOnDestroy(){this._cleanupTransitionEnd()}static \u0275fac=function(n){return new(n||e)};static \u0275dir=F({type:e,selectors:[["div","matFormFieldLineRipple",""]],hostAttrs:[1,"mdc-line-ripple"]})}return e})(),fe=(()=>{class e{_elementRef=l(L);_ngZone=l(S);open=!1;_notch;ngAfterViewInit(){let t=this._elementRef.nativeElement,n=t.querySelector(".mdc-floating-label");n?(t.classList.add("mdc-notched-outline--upgraded"),typeof requestAnimationFrame=="function"&&(n.style.transitionDuration="0s",this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>n.style.transitionDuration="")}))):t.classList.add("mdc-notched-outline--no-label")}_setNotchWidth(t){let n=this._notch.nativeElement;!this.open||!t?n.style.width="":n.style.width=`calc(${t}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`}_setMaxWidth(t){this._notch.nativeElement.style.setProperty("--mat-form-field-notch-max-width",`calc(100% - ${t}px)`)}static \u0275fac=function(n){return new(n||e)};static \u0275cmp=D({type:e,selectors:[["div","matFormFieldNotchedOutline",""]],viewQuery:function(n,a){if(n&1&&nt(Re,5),n&2){let o;b(o=h())&&(a._notch=o.first)}},hostAttrs:[1,"mdc-notched-outline"],hostVars:2,hostBindings:function(n,a){n&2&&M("mdc-notched-outline--notched",a.open)},inputs:{open:[0,"matFormFieldNotchedOutlineOpen","open"]},attrs:ze,ngContentSelectors:Pe,decls:5,vars:0,consts:[["notch",""],[1,"mat-mdc-notch-piece","mdc-notched-outline__leading"],[1,"mat-mdc-notch-piece","mdc-notched-outline__notch"],[1,"mat-mdc-notch-piece","mdc-notched-outline__trailing"]],template:function(n,a){n&1&&(B(),Z(0,"div",1),W(1,"div",2,0),y(3),Y(),Z(4,"div",3))},encapsulation:2,changeDetection:0})}return e})(),ln=(()=>{class e{value=null;stateChanges;id;placeholder;ngControl=null;focused=!1;empty=!1;shouldLabelFloat=!1;required=!1;disabled=!1;errorState=!1;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;static \u0275fac=function(n){return new(n||e)};static \u0275dir=F({type:e})}return e})();var sn=new C("MatFormField"),cn=new C("MAT_FORM_FIELD_DEFAULT_OPTIONS"),ue="fill",mn="auto",pe="fixed",fn="translateY(-50%)",he=(()=>{class e{_elementRef=l(L);_changeDetectorRef=l(Rt);_platform=l(H);_idGenerator=l(R);_ngZone=l(S);_defaults=l(cn,{optional:!0});_currentDirection;_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=j("iconPrefixContainer");_textPrefixContainerSignal=j("textPrefixContainer");_iconSuffixContainerSignal=j("iconSuffixContainer");_textSuffixContainerSignal=j("textSuffixContainer");_prefixSuffixContainers=K(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(t=>t?.nativeElement).filter(t=>t!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=Ot(ct);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(t){this._hideRequiredMarker=Xt(t)}_hideRequiredMarker=!1;color="primary";get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||mn}set floatLabel(t){t!==this._floatLabel&&(this._floatLabel=t,this._changeDetectorRef.markForCheck())}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(t){let n=t||this._defaults?.appearance||ue;this._appearanceSignal.set(n)}_appearanceSignal=U(ue);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||pe}set subscriptSizing(t){this._subscriptSizing=t||this._defaults?.subscriptSizing||pe}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(t){this._hintLabel=t,this._processHints()}_hintLabel="";_hasIconPrefix=!1;_hasTextPrefix=!1;_hasIconSuffix=!1;_hasTextSuffix=!1;_labelId=this._idGenerator.getId("mat-mdc-form-field-label-");_hintLabelId=this._idGenerator.getId("mat-mdc-hint-");_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(t){this._explicitFormFieldControl=t}_destroyed=new z;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=ie();constructor(){let t=this._defaults,n=l(ot);t&&(t.appearance&&(this.appearance=t.appearance),this._hideRequiredMarker=!!t?.hideRequiredMarker,t.color&&(this.color=t.color)),wt(()=>this._currentDirection=n.valueSignal()),this._syncOutlineLabelOffset()}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-form-field-animations-enabled")},300)}),this._changeDetectorRef.detectChanges()}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix()}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=this._control.ngControl.control.validator),this._previousControl=this._control),this._control.ngControl&&this._control.ngControl.control&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck()}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete()}getLabelId=K(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel="always")}_initializeControl(t){let n=this._control,a="mat-mdc-form-field-type-";t&&this._elementRef.nativeElement.classList.remove(a+t.controlType),n.controlType&&this._elementRef.nativeElement.classList.add(a+n.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=n.stateChanges.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck()}),this._describedByChanges?.unsubscribe(),this._describedByChanges=n.stateChanges.pipe(xt([void 0,void 0]),bt(()=>[n.errorState,n.userAriaDescribedBy]),gt(),V(([[o,s],[k,tt]])=>o!==k||s!==tt)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),n.ngControl&&n.ngControl.valueChanges&&(this._valueChanges=n.ngControl.valueChanges.pipe(q(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()))}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(t=>!t._isText),this._hasTextPrefix=!!this._prefixChildren.find(t=>t._isText),this._hasIconSuffix=!!this._suffixChildren.find(t=>!t._isText),this._hasTextSuffix=!!this._suffixChildren.find(t=>t._isText)}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),ht(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck()})}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck()}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck()}),this._validateHints(),this._syncDescribedByIds()}_assertFormFieldControl(){this._control}_updateFocusState(){let t=this._control.focused;t&&!this._isFocused?(this._isFocused=!0,this._lineRipple?.activate()):!t&&(this._isFocused||this._isFocused===null)&&(this._isFocused=!1,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle("mat-focused",t),this._textField?.nativeElement.classList.toggle("mdc-text-field--focused",t)}_syncOutlineLabelOffset(){zt({earlyRead:()=>{if(this._appearanceSignal()!=="outline")return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset())});for(let t of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(t,{box:"border-box"})}return this._getOutlinedLabelOffset()},write:t=>this._writeOutlinedLabelStyles(t())})}_shouldAlwaysFloat(){return this.floatLabel==="always"}_hasOutline(){return this.appearance==="outline"}_forceDisplayInfixLabel(){return!this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=K(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._control.shouldLabelFloat||this._shouldAlwaysFloat():!1}_shouldForward(t){let n=this._control?this._control.ngControl:null;return n&&n[t]}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._control.errorState?"error":"hint"}_handleLabelResized(){this._refreshOutlineNotchWidth()}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth())}_processHints(){this._validateHints(),this._syncDescribedByIds()}_validateHints(){this._hintChildren}_syncDescribedByIds(){if(this._control){let t=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy=="string"&&t.push(...this._control.userAriaDescribedBy.split(" ")),this._getSubscriptMessageType()==="hint"){let o=this._hintChildren?this._hintChildren.find(k=>k.align==="start"):null,s=this._hintChildren?this._hintChildren.find(k=>k.align==="end"):null;o?t.push(o.id):this._hintLabel&&t.push(this._hintLabelId),s&&t.push(s.id)}else this._errorChildren&&t.push(...this._errorChildren.map(o=>o.id));let n=this._control.describedByIds,a;if(n){let o=this._describedByIds||t;a=t.concat(n.filter(s=>s&&!o.includes(s)))}else a=t;this._control.setDescribedByIds(a),this._describedByIds=t}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return["",null];if(!this._isAttachedToDom())return null;let t=this._iconPrefixContainer?.nativeElement,n=this._textPrefixContainer?.nativeElement,a=this._iconSuffixContainer?.nativeElement,o=this._textSuffixContainer?.nativeElement,s=t?.getBoundingClientRect().width??0,k=n?.getBoundingClientRect().width??0,tt=a?.getBoundingClientRect().width??0,ye=o?.getBoundingClientRect().width??0,we=this._currentDirection==="rtl"?"-1":"1",Me=`${s+k}px`,Ce=`calc(${we} * (${Me} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,Fe=`var(--mat-mdc-form-field-label-transform, ${fn} translateX(${Ce}))`,Ee=s+k+tt+ye;return[Fe,Ee]}_writeOutlinedLabelStyles(t){if(t!==null){let[n,a]=t;this._floatingLabel&&(this._floatingLabel.element.style.transform=n),a!==null&&this._notchedOutline?._setMaxWidth(a)}}_isAttachedToDom(){let t=this._elementRef.nativeElement;if(t.getRootNode){let n=t.getRootNode();return n&&n!==t}return document.documentElement.contains(t)}static \u0275fac=function(n){return new(n||e)};static \u0275cmp=D({type:e,selectors:[["mat-form-field"]],contentQueries:function(n,a,o){if(n&1&&(Dt(o,a._labelChild,ct,5),St(o,ln,5)(o,on,5)(o,rn,5)(o,an,5)(o,mt,5)),n&2){at();let s;b(s=h())&&(a._formFieldControl=s.first),b(s=h())&&(a._prefixChildren=s),b(s=h())&&(a._suffixChildren=s),b(s=h())&&(a._errorChildren=s),b(s=h())&&(a._hintChildren=s)}},viewQuery:function(n,a){if(n&1&&(It(a._iconPrefixContainerSignal,oe,5)(a._textPrefixContainerSignal,re,5)(a._iconSuffixContainerSignal,de,5)(a._textSuffixContainerSignal,le,5),nt(Le,5)(oe,5)(re,5)(de,5)(le,5)(se,5)(fe,5)(me,5)),n&2){at(4);let o;b(o=h())&&(a._textField=o.first),b(o=h())&&(a._iconPrefixContainer=o.first),b(o=h())&&(a._textPrefixContainer=o.first),b(o=h())&&(a._iconSuffixContainer=o.first),b(o=h())&&(a._textSuffixContainer=o.first),b(o=h())&&(a._floatingLabel=o.first),b(o=h())&&(a._notchedOutline=o.first),b(o=h())&&(a._lineRipple=o.first)}},hostAttrs:[1,"mat-mdc-form-field"],hostVars:38,hostBindings:function(n,a){n&2&&M("mat-mdc-form-field-label-always-float",a._shouldAlwaysFloat())("mat-mdc-form-field-has-icon-prefix",a._hasIconPrefix)("mat-mdc-form-field-has-icon-suffix",a._hasIconSuffix)("mat-form-field-invalid",a._control.errorState)("mat-form-field-disabled",a._control.disabled)("mat-form-field-autofilled",a._control.autofilled)("mat-form-field-appearance-fill",a.appearance=="fill")("mat-form-field-appearance-outline",a.appearance=="outline")("mat-form-field-hide-placeholder",a._hasFloatingLabel()&&!a._shouldLabelFloat())("mat-primary",a.color!=="accent"&&a.color!=="warn")("mat-accent",a.color==="accent")("mat-warn",a.color==="warn")("ng-untouched",a._shouldForward("untouched"))("ng-touched",a._shouldForward("touched"))("ng-pristine",a._shouldForward("pristine"))("ng-dirty",a._shouldForward("dirty"))("ng-valid",a._shouldForward("valid"))("ng-invalid",a._shouldForward("invalid"))("ng-pending",a._shouldForward("pending"))},inputs:{hideRequiredMarker:"hideRequiredMarker",color:"color",floatLabel:"floatLabel",appearance:"appearance",subscriptSizing:"subscriptSizing",hintLabel:"hintLabel"},exportAs:["matFormField"],features:[Q([{provide:sn,useExisting:e},{provide:be,useExisting:e}])],ngContentSelectors:Be,decls:18,vars:21,consts:[["labelTemplate",""],["textField",""],["iconPrefixContainer",""],["textPrefixContainer",""],["textSuffixContainer",""],["iconSuffixContainer",""],[1,"mat-mdc-text-field-wrapper","mdc-text-field",3,"click"],[1,"mat-mdc-form-field-focus-overlay"],[1,"mat-mdc-form-field-flex"],["matFormFieldNotchedOutline","",3,"matFormFieldNotchedOutlineOpen"],[1,"mat-mdc-form-field-icon-prefix"],[1,"mat-mdc-form-field-text-prefix"],[1,"mat-mdc-form-field-infix"],[3,"ngTemplateOutlet"],[1,"mat-mdc-form-field-text-suffix"],[1,"mat-mdc-form-field-icon-suffix"],["matFormFieldLineRipple",""],["aria-atomic","true","aria-live","polite",1,"mat-mdc-form-field-subscript-wrapper","mat-mdc-form-field-bottom-align"],[1,"mat-mdc-form-field-error-wrapper"],[1,"mat-mdc-form-field-hint-wrapper"],["matFormFieldFloatingLabel","",3,"floating","monitorResize","id"],["aria-hidden","true",1,"mat-mdc-form-field-required-marker","mdc-floating-label--required"],[3,"id"],[1,"mat-mdc-form-field-hint-spacer"]],template:function(n,a){if(n&1&&(B(Ne),A(0,Ve,1,1,"ng-template",null,0,At),r(2,"div",6,1),O("click",function(s){return a._control.onContainerClick(s)}),g(4,qe,1,0,"div",7),r(5,"div",8),g(6,$e,2,2,"div",9),g(7,We,3,0,"div",10),g(8,Ye,3,0,"div",11),r(9,"div",12),g(10,Qe,1,1,null,13),y(11),d(),g(12,Ke,3,0,"div",14),g(13,Xe,3,0,"div",15),d(),g(14,Je,1,0,"div",16),d(),r(15,"div",17),g(16,tn,2,0,"div",18)(17,nn,5,1,"div",19),d()),n&2){let o;c(2),M("mdc-text-field--filled",!a._hasOutline())("mdc-text-field--outlined",a._hasOutline())("mdc-text-field--no-label",!a._hasFloatingLabel())("mdc-text-field--disabled",a._control.disabled)("mdc-text-field--invalid",a._control.errorState),c(2),v(!a._hasOutline()&&!a._control.disabled?4:-1),c(2),v(a._hasOutline()?6:-1),c(),v(a._hasIconPrefix?7:-1),c(),v(a._hasTextPrefix?8:-1),c(2),v(!a._hasOutline()||a._forceDisplayInfixLabel()?10:-1),c(2),v(a._hasTextSuffix?12:-1),c(),v(a._hasIconSuffix?13:-1),c(),v(a._hasOutline()?-1:14),c(),M("mat-mdc-form-field-subscript-dynamic-size",a.subscriptSizing==="dynamic");let s=a._getSubscriptMessageType();c(),v((o=s)==="error"?16:o==="hint"?17:-1)}},dependencies:[se,fe,Lt,me,mt],styles:[`.mdc-text-field {
  display: inline-flex;
  align-items: baseline;
  padding: 0 16px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  will-change: opacity, transform, color;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.mdc-text-field__input {
  width: 100%;
  min-width: 0;
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  height: 28px;
}
.mdc-text-field__input::-webkit-calendar-picker-indicator, .mdc-text-field__input::-webkit-search-cancel-button {
  display: none;
}
.mdc-text-field__input::-ms-clear {
  display: none;
}
.mdc-text-field__input:focus {
  outline: none;
}
.mdc-text-field__input:invalid {
  box-shadow: none;
}
.mdc-text-field__input::placeholder {
  opacity: 0;
}
.mdc-text-field__input::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field__input::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field__input:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  opacity: 1;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {
  height: 100%;
}
.mdc-text-field--outlined .mdc-text-field__input {
  display: flex;
  border: none !important;
  background-color: transparent;
}
.mdc-text-field--disabled .mdc-text-field__input {
  pointer-events: auto;
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));
  caret-color: var(--mat-form-field-filled-caret-color, var(--mat-sys-primary));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));
  caret-color: var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error));
}
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-text-field__input {
    background-color: Window;
  }
}

.mdc-text-field--filled {
  height: 56px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));
  border-top-right-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) {
  background-color: var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled {
  background-color: var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent));
}

.mdc-text-field--outlined {
  height: 56px;
  overflow: visible;
  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);
}
[dir=rtl] .mdc-text-field--outlined {
  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);
  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
}

.mdc-floating-label {
  position: absolute;
  left: 0;
  transform-origin: left top;
  line-height: 1.15rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  overflow: hidden;
  will-change: transform;
}
[dir=rtl] .mdc-floating-label {
  right: 0;
  left: auto;
  transform-origin: right top;
  text-align: right;
}
.mdc-text-field .mdc-floating-label {
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.mdc-notched-outline .mdc-floating-label {
  display: inline-block;
  position: relative;
  max-width: 100%;
}
.mdc-text-field--outlined .mdc-floating-label {
  left: 4px;
  right: auto;
}
[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {
  left: auto;
  right: 4px;
}
.mdc-text-field--filled .mdc-floating-label {
  left: 16px;
  right: auto;
}
[dir=rtl] .mdc-text-field--filled .mdc-floating-label {
  left: auto;
  right: 16px;
}
.mdc-text-field--disabled .mdc-floating-label {
  cursor: default;
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-floating-label {
    z-index: 1;
  }
}
.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {
  display: none;
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label {
  color: var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--filled .mdc-floating-label {
  font-family: var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label {
  color: var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--outlined .mdc-floating-label {
  font-family: var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking));
}

.mdc-floating-label--float-above {
  cursor: auto;
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--filled .mdc-floating-label--float-above {
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--outlined .mdc-floating-label--float-above {
  transform: translateY(-37.25px) scale(1);
  font-size: 0.75rem;
}
.mdc-notched-outline .mdc-floating-label--float-above {
  text-overflow: clip;
}
.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: 133.3333333333%;
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  transform: translateY(-34.75px) scale(0.75);
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: 1rem;
}

.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 1px;
  margin-right: 0;
  content: "*";
}
[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 0;
  margin-right: 1px;
}

.mdc-notched-outline {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 100%;
  text-align: left;
  pointer-events: none;
}
[dir=rtl] .mdc-notched-outline {
  text-align: right;
}
.mdc-text-field--outlined .mdc-notched-outline {
  z-index: 1;
}

.mat-mdc-notch-piece {
  box-sizing: border-box;
  height: 100%;
  pointer-events: none;
  border: none;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
.mdc-text-field--focused .mat-mdc-notch-piece {
  border-width: 2px;
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));
  border-width: var(--mat-form-field-outlined-outline-width, 1px);
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece {
  border-width: var(--mat-form-field-outlined-focus-outline-width, 2px);
}

.mdc-notched-outline__leading {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
  width: max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
}
[dir=rtl] .mdc-notched-outline__leading {
  border-left: none;
  border-right: 1px solid;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}

.mdc-notched-outline__trailing {
  flex-grow: 1;
  border-left: none;
  border-right: 1px solid;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}
[dir=rtl] .mdc-notched-outline__trailing {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}

.mdc-notched-outline__notch {
  flex: 0 0 auto;
  width: auto;
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch {
  max-width: min(var(--mat-form-field-notch-max-width, 100%), calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  max-width: min(100%, calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 1px;
}
.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 2px;
}
.mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 0;
  padding-right: 8px;
  border-top: none;
}
[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 8px;
  padding-right: 0;
}
.mdc-notched-outline--no-label .mdc-notched-outline__notch {
  display: none;
}

.mdc-line-ripple::before, .mdc-line-ripple::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom-style: solid;
  content: "";
}
.mdc-line-ripple::before {
  z-index: 1;
  border-bottom-width: var(--mat-form-field-filled-active-indicator-height, 1px);
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container));
}
.mdc-line-ripple::after {
  transform: scaleX(0);
  opacity: 0;
  z-index: 2;
}
.mdc-text-field--filled .mdc-line-ripple::after {
  border-bottom-width: var(--mat-form-field-filled-focus-active-indicator-height, 2px);
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary));
}
.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error));
}

.mdc-line-ripple--active::after {
  transform: scaleX(1);
  opacity: 1;
}

.mdc-line-ripple--deactivating::after {
  opacity: 0;
}

.mdc-text-field--disabled {
  pointer-events: none;
}

.mat-mdc-form-field-textarea-control {
  vertical-align: middle;
  resize: vertical;
  box-sizing: border-box;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  overflow: auto;
}

.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font: inherit;
  letter-spacing: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  border: none;
}

.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  line-height: normal;
  pointer-events: all;
  will-change: auto;
}

.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label {
  cursor: inherit;
}

.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,
.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control {
  height: auto;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color] {
  height: 23px;
}

.mat-mdc-text-field-wrapper {
  height: auto;
  flex: auto;
  will-change: auto;
}

.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-left: 0;
  --mat-mdc-form-field-label-offset-x: -16px;
}

.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

[dir=rtl] .mat-mdc-text-field-wrapper {
  padding-left: 16px;
  padding-right: 16px;
}
[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-left: 0;
}
[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

.mat-form-field-disabled .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
  opacity: 1;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label {
  left: auto;
  right: auto;
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {
  display: inline-block;
}

.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch {
  padding-top: 0;
}

.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: 1px solid transparent;
}

[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: none;
  border-right: 1px solid transparent;
}

.mat-mdc-form-field-infix {
  min-height: var(--mat-form-field-container-height, 56px);
  padding-top: var(--mat-form-field-filled-with-label-container-padding-top, 24px);
  padding-bottom: var(--mat-form-field-filled-with-label-container-padding-bottom, 8px);
}
.mdc-text-field--outlined .mat-mdc-form-field-infix, .mdc-text-field--no-label .mat-mdc-form-field-infix {
  padding-top: var(--mat-form-field-container-vertical-padding, 16px);
  padding-bottom: var(--mat-form-field-container-vertical-padding, 16px);
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
  top: calc(var(--mat-form-field-container-height, 56px) / 2);
}

.mdc-text-field--filled .mat-mdc-floating-label {
  display: var(--mat-form-field-filled-label-display, block);
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  --mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1))
    scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));
  transform: var(--mat-mdc-form-field-label-transform);
}

@keyframes _mat-form-field-subscript-animation {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.mat-mdc-form-field-subscript-wrapper {
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-error-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 16px;
  opacity: 1;
  transform: translateY(0);
  animation: _mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2);
}

.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper {
  position: static;
}

.mat-mdc-form-field-bottom-align::before {
  content: "";
  display: inline-block;
  height: 16px;
}

.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before {
  content: unset;
}

.mat-mdc-form-field-hint-end {
  order: 1;
}

.mat-mdc-form-field-hint-wrapper {
  display: flex;
}

.mat-mdc-form-field-hint-spacer {
  flex: 1 0 1em;
}

.mat-mdc-form-field-error {
  display: block;
  color: var(--mat-form-field-error-text-color, var(--mat-sys-error));
}

.mat-mdc-form-field-subscript-wrapper,
.mat-mdc-form-field-bottom-align::before {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));
  line-height: var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));
  font-size: var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));
  letter-spacing: var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));
  font-weight: var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight));
}

.mat-mdc-form-field-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  background-color: var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface));
}
.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay {
  opacity: var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {
  opacity: var(--mat-form-field-focus-state-layer-opacity, 0);
}

select.mat-mdc-form-field-input-control {
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: transparent;
  display: inline-flex;
  box-sizing: border-box;
}
select.mat-mdc-form-field-input-control:not(:disabled) {
  cursor: pointer;
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option {
  color: var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10));
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled {
  color: var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent));
}

.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -2.5px;
  pointer-events: none;
  color: var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant));
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  right: auto;
  left: 0;
}
.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after {
  color: var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary));
}
.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after {
  color: var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 15px;
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 0;
  padding-left: 15px;
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill .mat-mdc-text-field-wrapper {
    outline: solid 1px;
  }
}
@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper {
    outline-color: GrayText;
  }
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper {
    outline: dashed 3px;
  }
}

@media (forced-colors: active) {
  .mat-mdc-form-field.mat-focused .mdc-notched-outline {
    border: dashed 3px;
  }
}

.mat-mdc-form-field-input-control[type=date], .mat-mdc-form-field-input-control[type=datetime], .mat-mdc-form-field-input-control[type=datetime-local], .mat-mdc-form-field-input-control[type=month], .mat-mdc-form-field-input-control[type=week], .mat-mdc-form-field-input-control[type=time] {
  line-height: 1;
}
.mat-mdc-form-field-input-control::-webkit-datetime-edit {
  line-height: 1;
  padding: 0;
  margin-bottom: -2px;
}

.mat-mdc-form-field {
  --mat-mdc-form-field-floating-label-scale: 0.75;
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));
  line-height: var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));
  font-size: var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));
  letter-spacing: var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));
  font-weight: var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above {
  font-size: calc(var(--mat-form-field-outlined-label-text-populated-size) * var(--mat-mdc-form-field-floating-label-scale));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: var(--mat-form-field-outlined-label-text-populated-size);
}
[dir=rtl] .mat-mdc-form-field {
  text-align: right;
}

.mat-mdc-form-field-flex {
  display: inline-flex;
  align-items: baseline;
  box-sizing: border-box;
  width: 100%;
}

.mat-mdc-text-field-wrapper {
  width: 100%;
  z-index: 0;
}

.mat-mdc-form-field-icon-prefix,
.mat-mdc-form-field-icon-suffix {
  align-self: center;
  line-height: 0;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}
.mat-mdc-form-field-icon-prefix > .mat-icon,
.mat-mdc-form-field-icon-suffix > .mat-icon {
  padding: 0 12px;
  box-sizing: content-box;
}

.mat-mdc-form-field-icon-prefix {
  color: var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-prefix {
  color: var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-invalid .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error));
}
.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container));
}
.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error));
}

.mat-mdc-form-field-icon-prefix,
[dir=rtl] .mat-mdc-form-field-icon-suffix {
  padding: 0 4px 0 0;
}

.mat-mdc-form-field-icon-suffix,
[dir=rtl] .mat-mdc-form-field-icon-prefix {
  padding: 0 0 0 4px;
}

.mat-mdc-form-field-subscript-wrapper .mat-icon,
.mat-mdc-form-field label .mat-icon {
  width: 1em;
  height: 1em;
  font-size: inherit;
}

.mat-mdc-form-field-infix {
  flex: auto;
  min-width: 0;
  width: 180px;
  position: relative;
  box-sizing: border-box;
}
.mat-mdc-form-field-infix:has(textarea[cols]) {
  width: auto;
}

.mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: -1px;
  -webkit-clip-path: inset(-9em -999em -9em 1px);
  clip-path: inset(-9em -999em -9em 1px);
}
[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: 0;
  margin-right: -1px;
  -webkit-clip-path: inset(-9em 1px -9em -999em);
  clip-path: inset(-9em 1px -9em -999em);
}

.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input {
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {
  transition-duration: 75ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after {
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper {
  animation-duration: 300ms;
}

.mdc-notched-outline .mdc-floating-label {
  max-width: calc(100% + 1px);
}

.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: calc(133.3333333333% + 1px);
}
`],encapsulation:2,changeDetection:0})}return e})();var ft=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=f({imports:[ee,he,E]})}return e})();var ge=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=f({imports:[ft,ft,Jt,E]})}return e})();var ve=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=f({imports:[E]})}return e})();var xe=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=f({imports:[ve,E]})}return e})();function un(e,i){e&1&&(P(),r(0,"svg",53),p(1,"path",54)(2,"polyline",55)(3,"line",56),d())}function pn(e,i){e&1&&(r(0,"span"),m(1,"Ingresar al portal"),d())}function bn(e,i){e&1&&(r(0,"span"),m(1,"Verificando..."),d())}var _e=class e{constructor(i,t,n){this.fb=i;this.authService=t;this.router=n;this.form=this.fb.group({email:["",[X.required,X.email]],password:["",X.required]})}loading=!1;form;async login(){if(this.form.invalid)return;this.loading=!0;let{email:i,password:t}=this.form.getRawValue();this.authService.login(i,t).subscribe({next:n=>{this.loading=!1,this.authService.saveSession(n.token,n.user),this.router.navigate(["/transport"])},error:n=>{this.loading=!1,alert(n.error.error||"Error login")}})}static \u0275fac=function(t){return new(t||e)($(Yt),$(Ht),$(jt))};static \u0275cmp=D({type:e,selectors:[["app-login"]],decls:76,vars:7,consts:[[1,"login-wrapper"],[1,"bg-grid"],[1,"bg-glow"],[1,"brand-strip"],[1,"brand-inner"],[1,"brand-logo"],["viewBox","0 0 40 40","fill","none","xmlns","http://www.w3.org/2000/svg"],["x","2","y","14","width","28","height","16","rx","3","fill","currentColor","opacity","0.15"],["x","2","y","14","width","28","height","16","rx","3","stroke","currentColor","stroke-width","1.8"],["x","30","y","18","width","8","height","10","rx","2","fill","currentColor","opacity","0.2"],["x","30","y","18","width","8","height","10","rx","2","stroke","currentColor","stroke-width","1.8"],["cx","10","cy","31","r","4","fill","currentColor"],["cx","10","cy","31","r","2","fill","white","opacity","0.5"],["cx","26","cy","31","r","4","fill","currentColor"],["cx","26","cy","31","r","2","fill","white","opacity","0.5"],["d","M8 14V10a2 2 0 0 1 2-2h10l6 6","stroke","currentColor","stroke-width","1.8","stroke-linecap","round"],[1,"brand-name"],[1,"brand-tagline"],[1,"brand-stats"],[1,"stat"],[1,"stat-value"],[1,"stat-label"],[1,"stat-divider"],[1,"brand-footer"],[1,"login-main"],[1,"login-card"],[1,"card-header"],[1,"card-eyebrow"],[1,"card-title"],[1,"card-subtitle"],[1,"login-form",3,"ngSubmit","formGroup"],[1,"field-group"],["for","email",1,"field-label"],[1,"field-wrap"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.8",1,"field-icon"],["x","2","y","4","width","20","height","16","rx","3"],["d","m2 7 10 7 10-7"],["id","email","formControlName","email","type","email","placeholder","usuario@empresa.com","autocomplete","email",1,"field-input"],[1,"field-label-row"],["for","password",1,"field-label"],["href","#",1,"forgot-link"],["x","5","y","11","width","14","height","10","rx","2"],["d","M8 11V7a4 4 0 0 1 8 0v4"],["cx","12","cy","16","r","1.5","fill","currentColor"],["id","password","formControlName","password","type","password","placeholder","\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022","autocomplete","current-password",1,"field-input"],["type","submit",1,"btn-login",3,"disabled"],[1,"btn-text"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","width","16","height","16",4,"ngIf"],[4,"ngIf"],[1,"btn-shine"],[1,"card-footer"],[1,"footer-text"],["href","mailto:soporte@trucklogix.co",1,"footer-link"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","width","16","height","16"],["d","M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"],["points","10 17 15 12 10 7"],["x1","15","y1","12","x2","3","y2","12"]],template:function(t,n){t&1&&(r(0,"div",0),p(1,"div",1)(2,"div",2),r(3,"aside",3)(4,"div",4)(5,"div",5),P(),r(6,"svg",6),p(7,"rect",7)(8,"rect",8)(9,"rect",9)(10,"rect",10)(11,"circle",11)(12,"circle",12)(13,"circle",13)(14,"circle",14)(15,"path",15),d()(),G(),r(16,"span",16),m(17,"TruckLogix"),d(),r(18,"p",17),m(19,"Portal de Clientes"),d(),r(20,"div",18)(21,"div",19)(22,"span",20),m(23,"24/7"),d(),r(24,"span",21),m(25,"Disponibilidad"),d()(),p(26,"div",22),r(27,"div",19)(28,"span",20),m(29,"100%"),d(),r(30,"span",21),m(31,"Trazabilidad"),d()()(),r(32,"div",23)(33,"span"),m(34,"Portal Clientes \xB7 v2.4"),d()()()(),r(35,"main",24)(36,"div",25)(37,"header",26)(38,"span",27),m(39,"Bienvenido"),d(),r(40,"h2",28),m(41,"Inicia sesi\xF3n"),d(),r(42,"p",29),m(43,"Ingresa tus credenciales para acceder al portal"),d()(),r(44,"form",30),O("ngSubmit",function(){return n.login()}),r(45,"div",31)(46,"label",32),m(47,"Correo electr\xF3nico"),d(),r(48,"div",33),P(),r(49,"svg",34),p(50,"rect",35)(51,"path",36),d(),G(),p(52,"input",37),d()(),r(53,"div",31)(54,"div",38)(55,"label",39),m(56,"Contrase\xF1a"),d(),r(57,"a",40),m(58,"\xBFOlvidaste tu contrase\xF1a?"),d()(),r(59,"div",33),P(),r(60,"svg",34),p(61,"rect",41)(62,"path",42)(63,"circle",43),d(),G(),p(64,"input",44),d()(),r(65,"button",45)(66,"span",46),A(67,un,4,0,"svg",47)(68,pn,2,0,"span",48)(69,bn,2,0,"span",48),d(),p(70,"span",49),d()(),r(71,"footer",50)(72,"span",51),m(73,"\xBFProblemas para ingresar?"),d(),r(74,"a",52),m(75,"Contactar soporte"),d()()()()()),t&2&&(c(44),w("formGroup",n.form),c(21),M("btn-loading",n.loading),w("disabled",n.loading),c(2),w("ngIf",!n.loading),c(),w("ngIf",!n.loading),c(),w("ngIf",n.loading))},dependencies:[Nt,Pt,Zt,Ut,Vt,qt,Gt,Wt,$t,Kt,ge,xe],styles:['*[_ngcontent-%COMP%], *[_ngcontent-%COMP%]:before, *[_ngcontent-%COMP%]:after{box-sizing:border-box;margin:0;padding:0}.login-wrapper[_ngcontent-%COMP%]{min-height:100vh;display:flex;font-family:IBM Plex Sans,system-ui,sans-serif;position:relative;overflow:hidden;background:#f0f4f8}.bg-grid[_ngcontent-%COMP%]{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(26,111,219,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,111,219,.04) 1px,transparent 1px);background-size:40px 40px;z-index:0}.bg-glow[_ngcontent-%COMP%]{position:fixed;top:-200px;right:-100px;width:700px;height:700px;background:radial-gradient(circle,rgba(26,111,219,.08) 0%,transparent 70%);pointer-events:none;z-index:0}.brand-strip[_ngcontent-%COMP%]{width:340px;flex-shrink:0;background:linear-gradient(160deg,#0f1e35,#162845,#1a3255);position:relative;z-index:1;overflow:hidden}.brand-strip[_ngcontent-%COMP%]:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:32px 32px}.brand-strip[_ngcontent-%COMP%]:after{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#1a6fdb,#2d85f0,transparent)}@media(max-width:768px){.brand-strip[_ngcontent-%COMP%]{display:none}}.brand-inner[_ngcontent-%COMP%]{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;padding:48px 40px}.brand-logo[_ngcontent-%COMP%]{width:56px;height:56px;background:#1a6fdb26;border:1px solid rgba(26,111,219,.3);border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;color:#2d85f0}.brand-logo[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:32px;height:32px}.brand-name[_ngcontent-%COMP%]{display:block;font-size:28px;font-weight:700;color:#fff;letter-spacing:-.5px;margin-bottom:6px}.brand-tagline[_ngcontent-%COMP%]{font-size:12px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:#ffffff59;margin-bottom:auto}.brand-stats[_ngcontent-%COMP%]{display:flex;align-items:center;gap:24px;padding:24px 0;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:32px}.stat[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:3px}.stat-value[_ngcontent-%COMP%]{font-size:22px;font-weight:700;color:#fff;font-family:IBM Plex Mono,Fira Code,monospace;letter-spacing:-.5px}.stat-label[_ngcontent-%COMP%]{font-size:11px;color:#fff6;text-transform:uppercase;letter-spacing:1px}.stat-divider[_ngcontent-%COMP%]{width:1px;height:36px;background:#ffffff1f}.brand-footer[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:11px;color:#ffffff40;font-family:IBM Plex Mono,Fira Code,monospace;letter-spacing:.5px}.login-main[_ngcontent-%COMP%]{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 24px;position:relative;z-index:1}.login-card[_ngcontent-%COMP%]{width:100%;max-width:440px;background:#fff;border:1px solid #dde3ec;border-radius:16px;padding:44px 40px;box-shadow:0 1px 3px #0000000d,0 8px 32px #1a6fdb0f,0 0 0 1px #fffc inset;animation:_ngcontent-%COMP%_card-in .5s cubic-bezier(.22,1,.36,1) both}@keyframes _ngcontent-%COMP%_card-in{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@media(max-width:480px){.login-card[_ngcontent-%COMP%]{padding:32px 24px}}.card-header[_ngcontent-%COMP%]{margin-bottom:36px}.card-eyebrow[_ngcontent-%COMP%]{display:inline-block;font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#1a6fdb;background:#1a6fdb1f;border:1px solid rgba(26,111,219,.18);padding:3px 10px;border-radius:20px;margin-bottom:14px}.card-title[_ngcontent-%COMP%]{font-size:26px;font-weight:700;color:#1a2332;letter-spacing:-.4px;margin-bottom:6px}.card-subtitle[_ngcontent-%COMP%]{font-size:14px;color:#6b7a90;line-height:1.5}.login-form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:20px}.field-group[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:7px}.field-label-row[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between}.field-label[_ngcontent-%COMP%]{font-size:12px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:#6b7a90}.forgot-link[_ngcontent-%COMP%]{font-size:12px;color:#1a6fdb;text-decoration:none;font-weight:500;transition:color .15s}.forgot-link[_ngcontent-%COMP%]:hover{color:#1459b8;text-decoration:underline}.field-wrap[_ngcontent-%COMP%]{position:relative}.field-icon[_ngcontent-%COMP%]{position:absolute;left:13px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:#a0aab8;pointer-events:none;transition:color .2s}.field-input[_ngcontent-%COMP%]{width:100%;background:#f7f9fc;border:1.5px solid #dde3ec;border-radius:8px;color:#1a2332;font-family:IBM Plex Sans,system-ui,sans-serif;font-size:14px;padding:11px 14px 11px 42px;outline:none;transition:border-color .2s,box-shadow .2s,background .2s}.field-input[_ngcontent-%COMP%]::placeholder{color:#a0aab8}.field-input[_ngcontent-%COMP%]:focus{border-color:#1a6fdb;box-shadow:0 0 0 3px #1a6fdb1a;background:#fff}.field-input[_ngcontent-%COMP%]:focus + .field-icon[_ngcontent-%COMP%], .field-input[_ngcontent-%COMP%]:focus ~ .field-icon[_ngcontent-%COMP%]{color:#1a6fdb}.btn-login[_ngcontent-%COMP%]{position:relative;width:100%;background:linear-gradient(135deg,#1a6fdb,#2d85f0);border:none;border-radius:8px;color:#fff;font-family:IBM Plex Sans,system-ui,sans-serif;font-size:14.5px;font-weight:600;padding:13px 20px;cursor:pointer;overflow:hidden;margin-top:8px;letter-spacing:.3px;transition:transform .15s,box-shadow .15s,opacity .2s;box-shadow:0 4px 16px #1a6fdb59}.btn-login[_ngcontent-%COMP%]:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 22px #1a6fdb73}.btn-login[_ngcontent-%COMP%]:active:not(:disabled){transform:translateY(0)}.btn-login[_ngcontent-%COMP%]:disabled{opacity:.65;cursor:not-allowed}.btn-text[_ngcontent-%COMP%]{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:8px}.btn-shine[_ngcontent-%COMP%]{position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);transition:left 0s}.btn-login[_ngcontent-%COMP%]:hover   .btn-shine[_ngcontent-%COMP%]{left:150%;transition:left .5s ease}.btn-loading[_ngcontent-%COMP%]{background:linear-gradient(135deg,#1459b8,#1a6fdb)}.card-footer[_ngcontent-%COMP%]{margin-top:28px;padding-top:20px;border-top:1px solid #e8ecf2;display:flex;align-items:center;justify-content:center;gap:6px}.footer-text[_ngcontent-%COMP%]{font-size:13px;color:#a0aab8}.footer-link[_ngcontent-%COMP%]{font-size:13px;font-weight:500;color:#1a6fdb;text-decoration:none;transition:color .15s}.footer-link[_ngcontent-%COMP%]:hover{color:#1459b8;text-decoration:underline}']})};export{_e as LoginComponent};
