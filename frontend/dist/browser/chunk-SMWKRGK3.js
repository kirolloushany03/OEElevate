import{i as m,j as S,k as f}from"./chunk-V3II746O.js";import{$ as h,Sb as g,T as d,Tb as M,Ub as I,W as s,o as n}from"./chunk-E3A7H3BE.js";var v=(()=>{let t=class t{constructor(e){this.payload=e}};t.type="[Machines] Add machine";let r=t;return r})(),u=(()=>{let t=class t{constructor(){}};t.type="[Machines] Get machines";let r=t;return r})(),x=(()=>{let t=class t{constructor(e){this.id=e}};t.type="[Machines] Get machine by id";let r=t;return r})(),j=(()=>{let t=class t{constructor(e,i){this.machine=e,this.payload=i}};t.type="[Machines] Add OEE record";let r=t;return r})();var p={production:!1,apiUrl:"http://127.0.0.1:5000/api"};var b=(()=>{let t=class t{constructor(e){this.http=e}create(e,i){return this.http.post(p.apiUrl+e,i)}read(e,i){if(i){let l=new g;return Object.keys(i).forEach(y=>{l=l.append(y,i[y])}),this.http.get(p.apiUrl+e,{params:l})}return this.http.get(p.apiUrl+e)}update(e,i){return this.http.put(p.apiUrl+e,i)}delete(e){return this.http.delete(p.apiUrl+e)}};t.\u0275fac=function(i){return new(i||t)(h(I))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})();var E=(()=>{let t=class t{constructor(e){this.crud=e}addMachine(e){return this.crud.create("/machines",e)}getMachines(){return this.crud.read("/machines")}getMachinesSummary(){return this.crud.read("/machines/summary")}getMachineById(e){return this.crud.read(`/machines/${e}`)}addOeeRecord(e,i){return i.date=i.date.split(".")[0],this.crud.create(`/machine/${e.id}/oeeRecords`,i)}};t.\u0275fac=function(i){return new(i||t)(h(b))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})();var c,o=(c=class{constructor(t){this.machineService=t}static machines(t){return t.machines}static machineById(t){return t.machineById}addMachine(t,a){return this.machineService.addMachine(a.payload).pipe(d({next:e=>{t.dispatch(new u)},error:e=>console.error("Error adding machine",e)}))}getMachines(t,a){return this.machineService.getMachinesSummary().pipe(d({next:e=>{t.patchState({machines:e})},error:e=>console.error("Error getting machines",e)}))}getMachineById(t,a){return this.machineService.getMachineById(a.id).pipe(d({next:e=>{t.patchState({machineById:e})},error:e=>{e.status===M.NotFound&&t.patchState({machineById:{error:{status:e.status,message:e.message?.length?e.message:`Machine with id ${a.id} not found`}}})}}))}addOeeRecord(t,a){return this.machineService.addOeeRecord(a.machine,a.payload).pipe(d({next:e=>{t.dispatch(new u)},error:e=>console.error("Error adding OEE record",e)}))}},c.\u0275fac=function(a){return new(a||c)(h(E))},c.\u0275prov=s({token:c,factory:c.\u0275fac}),c);n([m(v)],o.prototype,"addMachine",null);n([m(u)],o.prototype,"getMachines",null);n([m(x)],o.prototype,"getMachineById",null);n([m(j)],o.prototype,"addOeeRecord",null);n([f()],o,"machines",null);n([f()],o,"machineById",null);o=n([S({name:"machines",defaults:{machines:[],machineById:null}})],o);export{b as a,v as b,u as c,x as d,j as e,o as f};
