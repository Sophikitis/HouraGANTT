import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, EmailValidator, Validators, FormBuilder} from '@angular/forms';
import { LoginService } from '../../providers/login.service';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';
import { toast} from 'angular2-materialize';
const { ipcRenderer } = require('electron')

interface Ilogin {
  access_token?: string;
  value:boolean
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})



export class LoginComponent implements OnInit {




// GROUP FORM //
  formLogin:    FormGroup;
  formRegister: FormGroup;

  // FORM CONTROLS //

  emailCtrl:                  FormControl;
  passwordCtrl:               FormControl;
  passwordLoginCtrl:          FormControl;
  passwordConfirmationCtrl:   FormControl;
  nameCtrl:                   FormControl;
  last_nameCtrl:              FormControl;
  rgpdCtrl:                   FormControl;


  public createUserAccountForm: FormGroup;
  public loginUserForm: FormGroup;
  public createAccount:boolean = false;
  public error = null;




  constructor(
    private router:Router,
    private http:HttpClient,
    public login:LoginService,
    private Token: TokenService,
    private Auth: AuthService
  )
  {
    console.log('ees')
    // TODO : CONDITION EVITER DOUBLON
    ipcRenderer.send('resize-login')
  }

  ngOnInit() {



    this.createFormControls();

    this.createFormLogin();
    this.createFormRegister()


  }

  createFormControls() {

    this.emailCtrl = new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern("[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")
    ]);

    this.passwordCtrl = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.pattern("^((?=\\S*?[A-Z])(?=\\S*?[a-z])(?=\\S*?[0-9]).{6,})\\S$")
    ]);

    this.passwordLoginCtrl = new FormControl('', [
      Validators.required,
    ]);

    this.nameCtrl = new FormControl('', [
      Validators.required,
      // TODO : PATTERN
    ]);

    this.last_nameCtrl = new FormControl('', [
      Validators.required,
      // TODO : PATTERN
    ]);

    this.rgpdCtrl = new FormControl('', [
      Validators.requiredTrue,
    ]);


  }

  createFormLogin() {
    this.formLogin = new FormGroup({

      emailCtrl: this.emailCtrl,
      passwordLoginCtrl: this.passwordLoginCtrl
    });
  }

  createFormRegister() {
    this.formRegister = new FormGroup({

      nameCtrl:this.nameCtrl,
      last_nameCtrl: this.last_nameCtrl,
      emailCtrl: this.emailCtrl,
      passwordCtrl: this.passwordCtrl,
      rgpdCtrl: this.rgpdCtrl,
    });
  }


  // TODO : JS DO
  logUser(form:any){
    this.login.loginUserAccount(form).then(res =>{

      if(res.value){
        this.handleResponse(res);
      }else{
        console.log("erreur", res.value, res.message)
        toast(res.message,3000, 'red');
      }
    }, err => {
      this.handleError(err);
    })
  }


    // TODO : JS DO
  createUser(form:any){
    this.login.createUserAccount(form).then(
    res =>{
      console.log(res)
      this.createAccount = false;
      this.formLogin.reset()
      this.formRegister.reset()
      toast("Création de compte reussie", 3000, 'blue');
    },
    err => {
      console.log(err)
      toast("Une erreur est survenue", 3000, 'alert');
    })

  }

  // TODO : JS DO
  switchView(val:boolean){
    if(val)
    {
      this.createAccount = true;
    }else
    {
      this.createAccount= false
    }
    this.formLogin.reset()
    this.formRegister.reset()

  }
  handleResponse(data) {
    this.Token.handle(data.access_token);
    this.Auth.changeAuthStatus(true);
    this.router.navigateByUrl('/dashboard');
  }

  handleError(error) {
    this.error = error.error.error;
  }

  popo(){
    console.log('test')
    ipcRenderer.send('resize')
  }

}
