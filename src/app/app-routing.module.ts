import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {AuthService as AuthGuard} from './auth.service';
import {ProfileComponent} from './profile/profile.component';
import {PostComponent} from './post/post.component';
import {PostNotFoundComponent} from './post-not-found/post-not-found.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'profile/:uid', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'post/404', component: PostNotFoundComponent, canActivate: [AuthGuard]},
  {path: 'post/:pid', component: PostComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: '', component: HomeComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
