import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/common/guards';
import { TimePlanningPnClaims } from 'src/app/plugins/modules/time-planning-pn/enums';
import { ClockInContainerComponent } from './components'; // Ensure this import is correct

export const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    component: ClockInContainerComponent,
    data: {
      requiredPermission: TimePlanningPnClaims.accessTimePlanningPlugin,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClockinRouting {}
