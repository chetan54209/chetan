import { Component, OnInit, ViewChild , ViewEncapsulation} from '@angular/core';
import { extend, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import {
  ScheduleComponent, ActionEventArgs, PopupOpenEventArgs, EventRenderedArgs, RenderCellEventArgs, DragAndDropService,
  TimelineViewsService, GroupModel, EventSettingsModel, ResizeService, TimeScaleModel, WorkHoursModel, View
} from '@syncfusion/ej2-angular-schedule';
import { roomData } from '../../data';
declare var $: any;
@Component({
  selector: 'app-sechduler',
  templateUrl: './sechduler.component.html',
  styleUrls: ['./sechduler.component.css']
})
export class SechdulerComponent implements OnInit {

  public selectedDate: Date = new Date(2018, 7, 1);
  public timeScale: TimeScaleModel = { interval: 60, slotCount: 12 };
  public workHours: WorkHoursModel = { start: '08:00', end: '18:00' };
  public currentView: View = 'TimelineWeek';
  public group: GroupModel = {
    enableCompactView: false,
    resources: ['MeetingRoom']
  };
  public resourceDataSource: Object[] = [
    { text: 'Jammy', id: 1, color: '#ea7a57', },
    { text: 'Tweety', id: 2, color: '#7fa900', },
    { text: 'Nestle', id: 3, color: '#5978ee', },
    { text: 'Phoenix', id: 4, color: '#fec200', },

    { text: 'Photogenic', id: 10, color: '#710193', }
  ];
  public allowMultiple: Boolean = true;
  public eventSettings: EventSettingsModel = {
    dataSource: <Object[]>extend([], roomData, null, true),
    fields: {
      id: 'Id',
      subject: { title: 'Summary', name: 'Subject' },
      location: { title: 'Location', name: 'Location' },
      description: { title: 'Comments', name: 'Description' },
      startTime: { title: 'From', name: 'StartTime' },
      endTime: { title: 'To', name: 'EndTime' }
    }
  };

  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;

  constructor() { }

  ngOnInit() {
    $(document).ready( () => {
      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
          $(this).toggleClass('active');
      });
  });
  }
  isReadOnly(endDate: Date): boolean {
    return (endDate < new Date(2018, 6, 31, 0, 0));
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    let data: { [key: string]: Object } = <{ [key: string]: Object }>args.data;
    if (args.type === 'QuickInfo' || args.type === 'Editor' || args.type === 'RecurrenceAlert' || args.type === 'DeleteAlert') {
      let target: HTMLElement = (args.type === 'RecurrenceAlert' ||
        args.type === 'DeleteAlert') ? (args.data as any).element[0] : args.target;
      if (!isNullOrUndefined(target) && target.classList.contains('e-work-cells')) {
        if ((target.classList.contains('e-read-only-cells')) ||
          (!this.scheduleObj.isSlotAvailable(data.startTime as Date, data.endTime as Date, data.groupIndex as number))) {
          args.cancel = true;
        }
      } else if (!isNullOrUndefined(target) && target.classList.contains('e-appointment') &&
        (this.isReadOnly(data.EndTime as Date))) {
        args.cancel = true;
      }
    }
  }

  onActionBegin(args: ActionEventArgs): void {
    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
      let data: { [key: string]: Object } = args.data as { [key: string]: Object };
      let groupIndex: number = this.scheduleObj.eventBase.getGroupIndexFromEvent(data);
      if (!this.scheduleObj.isSlotAvailable(data.StartTime as Date, data.EndTime as Date, groupIndex as number)) {
        args.cancel = true;
      }
    }
  }

  onRenderCell(args: RenderCellEventArgs): void {
    if (args.element.classList.contains('e-work-cells')) {
      if (args.date < new Date(2018, 6, 31, 0, 0)) {
        args.element.setAttribute('aria-readonly', 'true');
        args.element.classList.add('e-read-only-cells');
      }
    }
    if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
      let target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
      // target.innerHTML = '<div class="name">Rooms</div>';
    }
  }



  onEventRendered(args: EventRenderedArgs): void {
    let data: { [key: string]: Object } = args.data;
    if (this.isReadOnly(data.EndTime as Date)) {
      args.element.setAttribute('aria-readonly', 'true');
      args.element.classList.add('e-read-only');
    }
  }
}
