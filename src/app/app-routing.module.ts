import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {PostFullComponent} from './home/post-full/post-full.component';
import {ProfileComponent} from './profile/profile.component';
import {SettingsComponent} from './settings/settings.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'settings/edit', component: EditProfileComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'profile/404', component: NotFoundComponent},
  {path: 'profile/:uid', component: ProfileComponent},
  {path: 'post/:id', component: PostFullComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
