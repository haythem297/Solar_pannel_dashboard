import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-manage-configs',
  templateUrl: './manage-configs.component.html'
})

export class ManageConfigsComponent implements OnInit {
  public message: string;
  public FormConfigsMQTT:any;
  public configsMqtt:any;
  public Loading:Boolean;

  constructor(private fb: FormBuilder,private apiService: ApiService,private toastr:ToastrService) {
    this.FormConfigsMQTT = this.fb.group(
      {
        host: ["", [Validators.required]],
        port: ["", [Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(3),Validators.maxLength(4)]],
        temperature_sensor: ["", [Validators.required]],
        pressure_sensor: ["", [Validators.required]],
        voltage_sensor: ["", [Validators.required]],
        humidity_sensor: ["", [Validators.required]],
        lum_sensor: ["", [Validators.required]],
        amps_sensor: ["", [Validators.required]],
        energy_sensor: ["", [Validators.required]],
        system_state_path: ["", [Validators.required]],
        protocol:["ws"],
        path:["/mqtt"]
      }
    );
  }

  ngOnInit(){
    this.fetchConfgisMqttBroker();
  }

  get f() {
    return this.FormConfigsMQTT.controls;
  }

  fetchConfgisMqttBroker(){
    this.apiService
    .getConfigsMqtt()
    .pipe(first())
    .subscribe(
      (configs) => {
        this.configsMqtt = configs[0];
        if(this.configsMqtt.length>0){
          this.FormConfigsMQTT.controls.host.setValue(this.configsMqtt[0].host);
          this.FormConfigsMQTT.controls.port.setValue(this.configsMqtt[0].port);
          this.FormConfigsMQTT.controls.temperature_sensor.setValue(this.configsMqtt[0].temperature_sensor);
          this.FormConfigsMQTT.controls.pressure_sensor.setValue(this.configsMqtt[0].pressure_sensor);
          this.FormConfigsMQTT.controls.voltage_sensor.setValue(this.configsMqtt[0].voltage_sensor);
          this.FormConfigsMQTT.controls.humidity_sensor.setValue(this.configsMqtt[0].humidity_sensor);
          this.FormConfigsMQTT.controls.lum_sensor.setValue(this.configsMqtt[0].lum_sensor);
          this.FormConfigsMQTT.controls.amps_sensor.setValue(this.configsMqtt[0].amps_sensor);
          this.FormConfigsMQTT.controls.energy_sensor.setValue(this.configsMqtt[0].energy_sensor);
          this.FormConfigsMQTT.controls.system_state_path.setValue(this.configsMqtt[0].system_state_path);
        }
      },(error) => {});
  }
  
  saveConfgisMqtt(){
    if (!this.FormConfigsMQTT.valid) {
      return false;
    }
    this.Loading = true;
    this.apiService.saveConfigsMqtt(this.FormConfigsMQTT.value).pipe(first()).subscribe(() => {
        this.toastr.success('MQTT Configurations saved successfully','Success!');
    },(error) => {});
  }
}