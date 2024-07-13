import{c as L}from"./chunk-ICRGXVC6.js";import{c as P,d as q,g as I,h as M}from"./chunk-V3II746O.js";import{E as l,F as R,c as O,d as T,f as B}from"./chunk-7BF4GOP2.js";import{Aa as c,Lb as b,Mb as _,Na as v,Ob as D,Pa as r,Ta as e,Ua as a,Va as s,Za as h,_a as w,cb as S,db as C,eb as U,ga as x,gb as d,ib as F,kb as E,lb as g,nb as f,ob as y,za as t}from"./chunk-E3A7H3BE.js";var Q=()=>({mode:"password"});function A(m,o){if(m&1&&(e(0,"p",21),d(1),f(2,"async"),a()),m&2){let $=w();t(),F(" ",y(2,1,$.signUpError$),`
`)}}var X=(()=>{let o=class o{getPassword(){return this.signUpForm.password}constructor(p,i){this.store=p,this.router=i,this.signUpError$=this.store.select(n=>n.auth.signUpError),this.signUpForm={username:"",company_name:"",email:"",password:"",confirmPassword:""},this.passwordPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/}onSignUp(p){p.preventDefault(),this.formComponent?.instance.validate()?.isValid&&this.store.dispatch(new L(this.signUpForm))}};o.\u0275fac=function(i){return new(i||o)(c(M),c(P))},o.\u0275cmp=x({type:o,selectors:[["app-sign-up"]],viewQuery:function(i,n){if(i&1&&S(l,5),i&2){let u;C(u=U())&&(n.formComponent=u.first)}},standalone:!0,features:[E],decls:27,vars:13,consts:[[1,"mb-4"],[1,"flex","flex-col","gap-3","w-5/6","max-w-96",3,"submit"],[3,"formData"],["dataField","username"],["type","required","message","Username is required"],["type","stringLength","message","Username must be at least 3 characters long",3,"min"],["dataField","company_name"],["type","required","message","Company name is required"],["type","stringLength","message","Company name must be at least 3 characters long",3,"min"],["dataField","email"],["type","required","message","Email is required"],["type","email","message","Email is invalid"],["dataField","password","type","password",3,"editorOptions"],["type","required","message","Password is required"],["type","pattern","message","Password must contain at least 8 characters, 1 number, 1 uppercase and 1 lowercase letter",3,"pattern"],["dataField","confirmPassword","type","password",3,"editorOptions"],["type","compare","message","Must be the same as password",3,"comparisonTarget"],["itemType","button"],["text","Log in",3,"useSubmitBehavior"],["class","text-danger",4,"ngIf"],["routerLink","/login",1,"text-primary"],[1,"text-danger"]],template:function(i,n){i&1&&(e(0,"h1",0),d(1,"Sign Up "),a(),e(2,"form",1),h("submit",function(j){return n.onSignUp(j)}),e(3,"dx-form",2)(4,"dxi-item",3),s(5,"dxi-validation-rule",4)(6,"dxi-validation-rule",5),a(),e(7,"dxi-item",6),s(8,"dxi-validation-rule",7)(9,"dxi-validation-rule",8),a(),e(10,"dxi-item",9),s(11,"dxi-validation-rule",10)(12,"dxi-validation-rule",11),a(),e(13,"dxi-item",12),s(14,"dxi-validation-rule",13)(15,"dxi-validation-rule",14),a(),e(16,"dxi-item",15),s(17,"dxi-validation-rule",13)(18,"dxi-validation-rule",16),a(),e(19,"dxi-item",17),s(20,"dxo-button-options",18),a()()(),v(21,A,3,3,"p",19),f(22,"async"),e(23,"p"),d(24," Already have an account? "),e(25,"a",20),d(26," Log in "),a()()),i&2&&(t(3),r("formData",n.signUpForm),t(3),r("min",3),t(3),r("min",3),t(4),r("editorOptions",g(11,Q)),t(2),r("pattern",n.passwordPattern),t(),r("editorOptions",g(12,Q)),t(2),r("comparisonTarget",n.getPassword.bind(n)),t(2),r("useSubmitBehavior",!0),t(),r("ngIf",y(22,9,n.signUpError$)))},dependencies:[D,b,_,R,l,T,O,B,I,q],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%}"]});let m=o;return m})();export{X as SignUpComponent};
