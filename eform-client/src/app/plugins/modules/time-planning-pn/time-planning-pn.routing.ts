import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, PermissionGuard } from 'src/app/common/guards';
import { TimePlanningPnClaims } from './enums';
import { TimePlanningPnLayoutComponent } from './layouts';
import { ClockInContainerComponent } from './modules/clockin/components/clockin-container/clockin-container.component';


export const routes: Routes = [
  {
    path: '',
    component: TimePlanningPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {
      requiredPermission: TimePlanningPnClaims.accessTimePlanningPlugin,
    },
    children: [
/*      {
        path: 'planning',
        canActivate: [PermissionGuard],
        data: {
          requiredPermission: TimePlanningPnClaims.accessTimePlanningPlugin,
        },
        component: TimePlanningsContainerComponent,
      },*/
      {
        path: 'working-hours',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./modules/working-hours/working-hours.module').then(
            (m) => m.WorkingHoursModule
          ),
      },
      {
        path: 'flex',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./modules/flexes/flex.module').then(
            (m) => m.FlexModule
          ),
      },
      {
        path: 'registration-devices',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./modules/registration-devices/registration-devices.module').then(
            (m) => m.RegistrationDevicesModule
          ),
      },
      {
        path: 'clockin',
        component: ClockInContainerComponent, 
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./modules/clockin/clockin.module').then((m) => m.ClockinModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimePlanningPnRouting {}
