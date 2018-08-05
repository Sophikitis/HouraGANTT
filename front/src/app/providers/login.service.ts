import { Injectable } from '@angular/core';
import { config } from '../config/config';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, EmailValidator, Validators, FormBuilder} from '@angular/forms';

interface Ilogin {
  access_token?: string;
  value:boolean;
  message?:string
}

const httpOptions = {
  headers: new HttpHeaders({
    'Accept':  'application/json',
    // 'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class LoginService {

  apiUrl = config.ApiUrl;
  // PROD
  // private apiUrl: string = "http://10.2.110.29:2080/api"


  // public createAccount:boolean = false;





  constructor(
    private router:Router,
    private http:HttpClient,) {

     }


  loginUserAccount(form:any):Promise<Ilogin>{

    let pkg = {
      email : form.emailCtrl,
      password : form.passwordLoginCtrl
    }

    let urlLogin : string = this.apiUrl+'/login';
    let ret

    return this.http.post<Ilogin>(urlLogin,pkg,httpOptions)
    .toPromise()
    .then(res => {
      console.log('okok',res)
      if(res.message == "Email or password does't exist"){
       return  ret = {value : false, message: "Aucun compte pour ces identifiants"}
      }else{
        return ret = {value : true, access_token: res.access_token}
      }

    },err => {
      console.log("LoginService|loginUserAccount | Erreur", err)
      // return err
      console.log('erreur de connection')
      return ret = {value:false}
    })

  }



  createUserAccount(form: any):Promise<boolean> {

    let pkg = {
      first_name : form.nameCtrl,
      last_name : form.last_nameCtrl,
      password : form.passwordCtrl,
      password_confirmation : form.passwordCtrl,
      email : form.emailCtrl
    }


    let urlCreateAccount : string = this.apiUrl+'/signup';


    return this.http.post(urlCreateAccount,pkg,httpOptions)
    .toPromise()
    .then(res => {
      console.log("CreateUserAccount | ok ", res)
      // return view login
      // this.createAccount = false;
      return true

    },err => {
      console.log("CreateUserAccount | Erreur", err)
      return false

    })
  }

  UpdateProfile(form: any):Promise<boolean> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    let pkg = {
      first_name : form.nameCtrl,
      last_name : form.last_nameCtrl,
      password : form.passwordCtrl,
      password_confirmation : form.passwordCtrl,
    }
    let updateProfileAccount : string = this.apiUrl+'/me/update';
    return this.http.put(updateProfileAccount,pkg,httpOptions)
    .toPromise()
    .then(res => {
      console.log("CreateUserAccount | ok ", res)
      // return view login
      // this.createAccount = false;
      return true

    },err => {
      console.log("CreateUserAccount | Erreur", err)
      return false

    })
  }

}
