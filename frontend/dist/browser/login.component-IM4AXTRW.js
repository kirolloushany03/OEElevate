import{a as V}from"./chunk-GTYHA3F5.js";import{J as $,K as j,c as O,d as Q,f as T}from"./chunk-3D4RP6UK.js";import{F as n,G as u,M as h,Ma as P,N as m,Na as R,Qa as q,R as t,Ra as B,S as r,T as d,W as v,X as w,Y as C,aa as E,ba as S,ca as _,ea as p,ga as b,ia as L,ja as D,la as c,ma as f,u as g,va as F,xa as I,y as x,z as y,za as M}from"./chunk-I77CHCRL.js";var N=["formComponent"],z=()=>({mode:"password"});function J(a,o){if(a&1&&(t(0,"p",14),p(1),c(2,"async"),r()),a&2){let A=C();n(),b(" ",f(2,1,A.loginError$),`
`)}}var oe=(()=>{let o=class o{constructor(s,e){this.store=s,this.router=e,this.loginForm={email:"",password:""},this.passwordPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,this.loginError$=this.store.select(i=>i.auth.loginError)}onLogin(s){s.preventDefault(),this.store.dispatch(new V(this.loginForm)).subscribe(()=>{this.router.navigate(["/dashboard"])})}};o.\u0275fac=function(e){return new(e||o)(u(B),u(P))},o.\u0275cmp=g({type:o,selectors:[["app-login"]],viewQuery:function(e,i){if(e&1&&E(N,5),e&2){let l;S(l=_())&&(i.formComponent=l.first)}},standalone:!0,features:[L],decls:19,vars:8,consts:[["formComponent",""],[1,"mb-4"],[1,"flex","flex-col","gap-3","w-5/6","max-w-96",3,"submit"],[3,"formData"],["dataField","email"],["type","required","message","Email is required"],["type","email","message","Email is invalid"],["dataField","password","type","password",3,"editorOptions"],["type","required","message","Password is required"],["type","pattern","message","Password must contain at least 8 characters, 1 number, 1 uppercase and 1 lowercase letter",3,"pattern"],["itemType","button"],["text","Log in",3,"useSubmitBehavior"],["class","text-danger",4,"ngIf"],["routerLink","/sign-up",1,"text-primary"],[1,"text-danger"]],template:function(e,i){if(e&1){let l=v();t(0,"h1",1),p(1,"Login"),r(),t(2,"form",2),w("submit",function(k){return x(l),y(i.onLogin(k))}),t(3,"dx-form",3,0)(5,"dxi-item",4),d(6,"dxi-validation-rule",5)(7,"dxi-validation-rule",6),r(),t(8,"dxi-item",7),d(9,"dxi-validation-rule",8)(10,"dxi-validation-rule",9),r(),t(11,"dxi-item",10),d(12,"dxo-button-options",11),r()()(),h(13,J,3,3,"p",12),c(14,"async"),t(15,"p"),p(16," Don't have an account? "),t(17,"a",13),p(18," Sign up "),r()()}e&2&&(n(3),m("formData",i.loginForm),n(5),m("editorOptions",D(7,z)),n(2),m("pattern",i.passwordPattern),n(2),m("useSubmitBehavior",!0),n(),m("ngIf",f(14,5,i.loginError$)))},dependencies:[M,F,I,j,$,Q,O,T,q,R],styles:[`[_nghost-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%}
/*# sourceMappingURL=login.component-XNLWAIJE.css.map */`]});let a=o;return a})();export{oe as LoginComponent};
//# sourceMappingURL=login.component-IM4AXTRW.js.map