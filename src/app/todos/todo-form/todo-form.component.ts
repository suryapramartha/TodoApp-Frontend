import { AuthService } from './../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit, OnDestroy {

  data: any = {};
  dataSubscription: Subscription;
  updateSubscription: Subscription;
  createSubscription: Subscription;
  createMode = false;
  statusCombobox = [
    {name: 'New'},
    {name: 'On Progress'},
    {name: 'Completed'}
  ];

  constructor(
    private dataService: DataService,
    private router: ActivatedRoute,
    private route: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.data.userId = sessionStorage.getItem('username');
    const username = this.router.snapshot.paramMap.get('username');
    const id = this.router.snapshot.paramMap.get('id');
    if (!(username && id)) {
      this.createMode = true;
    } else {
      this.dataSubscription = this.dataService.getTodoDetail(username, id).subscribe(data => {
        this.data = data;
      }, (error: Response) => {
        this.authService.logoutWithStatus(error.status);
      });
    }
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.createSubscription) {
      this.createSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  createData() {
    this.createSubscription = this.dataService.createTodo(this.data).subscribe((a: Response) => {
      console.log(a);
      this.route.navigate(['my/todos']);
    }, (error: Response) => {
      this.authService.logoutWithStatus(error.status);
    });
  }

  updateData() {
    this.updateSubscription = this.dataService.updateTodo(this.data).subscribe(() => {
      this.route.navigate(['my/todos']);
    }, (error: Response) => {
      this.authService.logoutWithStatus(error.status);
    });
  }

}
