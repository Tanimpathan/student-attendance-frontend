import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-logs',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  template: `
    <div class="page-header"><h2>My Login Logs</h2></div>
    <mat-card>
      <table class="logs" *ngIf="myLogs.length; else empty">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let l of myLogs">
            <td>{{ l.at }}</td>
            <td>{{ l.ip }}</td>
          </tr>
        </tbody>
      </table>
      <ng-template #empty><p class="muted">No logs yet.</p></ng-template>
    </mat-card>
  `,
})
export class StudentLogsComponent {
  myLogs: Array<{ at: string; ip: string }> = [];
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const all = JSON.parse(localStorage.getItem('login_logs') || '[]') as Array<{
      username: string;
      role: string;
      at: string;
      ip: string;
    }>;
    if (user?.username) {
      this.myLogs = all
        .filter((l) => l.username === user.username)
        .map((l) => ({ at: l.at, ip: l.ip }));
    }
  }
}
