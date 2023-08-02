import { formatDate } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { IMqttMessage, IMqttServiceOptions, MqttService } from "ngx-mqtt";
import { Subscription } from "rxjs";
import { interval } from "rxjs";
import { first } from "rxjs/operators";
import { ApiService } from "src/app/services/api.service";
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit, OnDestroy {
  totalUsers: number = 0;
  totalPasswordsReset: number = 0;
  statusSubscription: Subscription;
  temperatureSubscription: Subscription;
  pressureSubscription: Subscription;
  voltageSubscription: Subscription;
  humiditySubscription: Subscription;
  ampsSubscription: Subscription;
  lumSubscription: Subscription;
  energySubscription: Subscription;
  message: any;
  client: any;
  configs: IMqttServiceOptions;
  enableMqtt: Boolean = false;
  systemStatus: Boolean = false;
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Environment Temperature' },
    { data: [], label: 'Voltage' },
    { data: [], label: 'Current' },
    { data: [], label: 'Energy' }
  ];
  lineChartLabels: Label[] = [];
  lineChartOptions = {
    responsive: true,
    animation: {
      duration: 500
    }
  };
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  tempValue = 0;
  tempLabel = "Temperature";
  tempAppendText = "°C";
  tempMax = 100;
  tempThresholdConfig = {
    '0': { color: 'green' },
    '26': { color: 'yellow' },
    '50': { color: 'red' }
  };

  pressureValue = 0;
  pressureLabel = "Pressure";
  pressureAppendText = "mB";
  pressureMax = 5000;
  pressureThresholdConfig = {
    '0': { color: 'yellow' },
    '901': { color: 'green' },
    '2000': { color: 'red' }
  };

  humidityValue = 0;
  humidityLabel = "Humidity";
  humidityAppendText = "%";
  humidityMax = 100;
  humidityThresholdConfig = {
    '0': { color: 'yellow' },
    '20': { color: 'green' },
    '60': { color: 'red' }
  };

  voltageValue = 0;
  voltageLabel = "Voltage";
  voltageAppendText = "V";
  voltageMax = 34;
  voltageThresholdConfig = {
    '0': { color: 'yellow' },
    '3': { color: 'green' },
    '15': { color: 'red' }
  };

  lumValue = 0;
  lumLabel = "Luminosity";
  lumAppendText = "Lux";
  lumMax = 12000;
  lumThresholdConfig = {
    '0': { color: 'red' },
    '2000': { color: 'yellow' },
    '3000': { color: 'green' }
  };

  ampsValue = 0;
  ampsLabel = "Current";
  ampsAppendText = "mA";
  ampsMax = 3000;
  ampsThresholdConfig = {
    '-1000': { color: 'red' },
    '0': { color: 'yellow' },
    '1000': { color: 'green' }
  };

  energyValue = 0;
  energyLabel = "Energy";
  energyAppendText = "mW";
  energyMax = 5000;
  energyThresholdConfig = {
    '0': { color: 'yellow' },
    '1000': { color: 'green' },
    '3000': { color: 'red' }
  };

  gaugeType = "arch";
  gaugeForgroundColor = "white";
  gaugeThick = 15;
  gaugeCap = "round";
  gaugeSize = 265;

  constructor(
    private apiService: ApiService,
    private _mqttService: MqttService
  ) { }

  public unsafePublish(topic: string, message: string): void {
    if (this.systemStatus)
      this._mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
    this.systemStatus = false;
  }

  public ngOnDestroy() {
    if (this.systemStatus) {
      this.statusSubscription.unsubscribe();
      this.temperatureSubscription.unsubscribe();
      this.pressureSubscription.unsubscribe();
      this.humiditySubscription.unsubscribe();
      this.voltageSubscription.unsubscribe();
      this.lumSubscription.unsubscribe();
      this.ampsSubscription.unsubscribe();
      this.energySubscription.unsubscribe();
      this.systemStatus = false;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.apiService
        .getConfigsMqtt()
        .pipe(first())
        .subscribe(
          (data) => {
            if (data[0].length > 0) {
              this._mqttService.connect({ hostname: data[0][0].host, port: data[0][0].port, path: '/mqtt',username:'admin',password:'raspberry' });
              this.statusSubscription = this._mqttService.observe(data[0][0].system_state_path).subscribe((status: IMqttMessage) => {
                if (status.payload.toString() == 'Connected')
                  this.systemStatus = true;
              }, (error => {
                this.systemStatus = false;
              }));
              this.temperatureSubscription = this._mqttService.observe(data[0][0].temperature_sensor).subscribe((temperature: IMqttMessage) => {
                this.systemStatus = true;
                this.tempValue = parseFloat(parseFloat(temperature.payload.toString()).toFixed(1));
                let date = formatDate(new Date(), 'H:mm:ss', 'en');
                if (this.lineChartData[0].data.length < 7) {
                  this.lineChartData[0].data.push(parseInt(temperature.payload.toString()));
                  if(this.lineChartLabels.indexOf(date) !== -1){
                    this.lineChartLabels.shift();
                    this.lineChartLabels.push(formatDate(new Date(), 'H:mm:ss', 'en'));
                  }
                } else {
                  this.lineChartData[0].data.shift();
                  this.lineChartData[0].data.push(data.data);
                  if(this.lineChartLabels.indexOf(date) !== -1){
                    this.lineChartLabels.shift();
                    this.lineChartLabels.push(formatDate(new Date(), 'H:mm:ss', 'en'));
                  }
                }
              });
              this.pressureSubscription = this._mqttService.observe(data[0][0].pressure_sensor).subscribe((pressure: IMqttMessage) => {
                this.systemStatus = true;
                this.pressureValue = parseInt(pressure.payload.toString());
              });
              this.humiditySubscription = this._mqttService.observe(data[0][0].humidity_sensor).subscribe((humidity: IMqttMessage) => {
                this.systemStatus = true;
                this.humidityValue = parseInt(humidity.payload.toString());
              });
              this.voltageSubscription = this._mqttService.observe(data[0][0].voltage_sensor).subscribe((voltage: IMqttMessage) => {
                this.systemStatus = true;
                this.voltageValue = parseFloat(voltage.payload.toString());
                let date = formatDate(new Date(), 'H:mm:ss', 'en');
                if (this.lineChartData[1].data.length < 7) {
                  this.lineChartData[1].data.push(parseInt(voltage.payload.toString()));
                  if(this.lineChartLabels.indexOf(date) !== -1){
                    this.lineChartLabels.shift();
                    this.lineChartLabels.push(formatDate(new Date(), 'H:mm:ss', 'en'));
                  }
                } else {
                  this.lineChartData[1].data.shift();
                  this.lineChartData[1].data.push(data.data);
                  if(this.lineChartLabels.indexOf(date) !== -1){
                    this.lineChartLabels.shift();
                    this.lineChartLabels.push(formatDate(new Date(), 'H:mm:ss', 'en'));
                  }
                }
              });
              this.lumSubscription = this._mqttService.observe(data[0][0].lum_sensor).subscribe((lum: IMqttMessage) => {
                this.systemStatus = true;
                this.lumValue = parseFloat(lum.payload.toString());
              });

              this.ampsSubscription = this._mqttService.observe(data[0][0].amps_sensor).subscribe((amps: IMqttMessage) => {
                this.systemStatus = true;
                this.ampsValue = parseFloat(amps.payload.toString());
                let date = formatDate(new Date(), 'H:mm:ss', 'en');
                if (this.lineChartData[2].data.length < 7) {
                  this.lineChartData[2].data.push(parseInt(amps.payload.toString()));
                  if(this.lineChartLabels.indexOf(date) !== -1){
                    this.lineChartLabels.shift();
                    this.lineChartLabels.push(formatDate(new Date(), 'H:mm:ss', 'en'));
                  }
                } else {
                  this.lineChartData[2].data.shift();
                  this.lineChartData[2].data.push(data.data);
                  if(this.lineChartLabels.indexOf(date) !== -1){
                    this.lineChartLabels.shift();
                    this.lineChartLabels.push(formatDate(new Date(), 'H:mm:ss', 'en'));
                  }
                }
              });
              this.energySubscription = this._mqttService.observe(data[0][0].energy_sensor).subscribe((energy: IMqttMessage) => {
                this.systemStatus = true;
                this.energyValue = parseFloat(energy.payload.toString());
                let date = formatDate(new Date(), 'H:mm:ss', 'en');
                if (this.lineChartData[3].data.length < 7) {
                  this.lineChartData[3].data.push(parseInt(energy.payload.toString()));
                  if(this.lineChartLabels.indexOf(date) !== -1){
                    this.lineChartLabels.shift();
                    this.lineChartLabels.push(formatDate(new Date(), 'H:mm:ss', 'en'));
                  }
                } else {
                  this.lineChartData[3].data.shift();
                  this.lineChartData[3].data.push(data.data);
                  if(this.lineChartLabels.indexOf(date) !== -1){
                    this.lineChartLabels.shift();
                    this.lineChartLabels.push(formatDate(new Date(), 'H:mm:ss', 'en'));
                  }
                }
              });
            }
          }, (error) => { });
    }, 2000);
    this.apiService
      .conutUsers()
      .pipe(first())
      .subscribe(
        (total) => {
          this.totalUsers = total;
        },
        (error) => { }
      );
      this.apiService
      .conutPasswordsReset()
      .pipe(first())
      .subscribe(
        (total) => {
          this.totalPasswordsReset = total;
        },
        (error) => { }
      );
      /* interval(4000).subscribe((x) => {
        this.apiService
          .test()
          .pipe(first())
          .subscribe(
            (data) => {
              let date = formatDate(new Date(), 'H:mm:ss', 'en');
              this.tempValue = data.data;
              this.pressureValue = data.data * 10;
              this.voltageValue = data.data;
              if (this.lineChartData[0].data.length < 7) {
                this.lineChartData[0].data.push(data.data);
                if(this.lineChartLabels.indexOf(date) !== -1){
                  this.lineChartLabels.shift();
                  this.lineChartLabels.push(formatDate(new Date(), 'H:mm:ss', 'en'));
                }
              } else {
                this.lineChartData[0].data.shift();
                this.lineChartData[0].data.push(data.data);
                if(this.lineChartLabels.indexOf(date) !== -1){
                  this.lineChartLabels.shift();
                  this.lineChartLabels.push(formatDate(new Date(), 'H:mm:ss', 'en'));
                }
              }
            },
            (error) => { }
          );
      }); */
  }
  
}
