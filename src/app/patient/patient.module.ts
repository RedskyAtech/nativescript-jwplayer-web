import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { PatientRoutingModule } from "./patient-routing.module";
import { PatientComponent } from "./components/patient.component";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        PatientRoutingModule,
    ],
    declarations: [
        PatientComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class PatientModule { }
