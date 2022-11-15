import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Event, Router } from '@angular/router';

declare const $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'smarthr';
  url: string;
  constructor(private router: Router){
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url.split('/');
        this.url = url[1];
        if (
          event.url == '/' ||
          event.url == '/login' ||
          event.url == '/login/register' ||
          event.url == '/login/forgot' ||
          event.url == '/login/otp' ||
          event.url == '/login/lockscreen'
        ) {
          document.querySelector('body').classList.add('account-page');
        } else {
          document.querySelector('body').classList.remove('account-page');
        }
        if (
          event.url == '/error/error404' ||
          event.url == '/error/error500'
        ) {
          document.querySelector('body').classList.add('error-page');
        } else {
          document.querySelector('body').classList.remove('error-page');
        }
      }
    });
  }
  ngOnInit() {

    // Minified Sidebar

    $(document).on('click', '#toggle_btn', () => {
      if ($('body').hasClass('mini-sidebar')) {
        $('body').removeClass('mini-sidebar');
        $('.subdrop + ul').slideDown();
      } else {
        $('body').addClass('mini-sidebar');
        $('.subdrop + ul').slideUp();
      }
      return false;
    });

    $(document).on('mouseover', (e) => {
      e.stopPropagation();
      if ($('body').hasClass('mini-sidebar') && $('#toggle_btn').is(':visible')) {
        const targ = $(e.target).closest('.sidebar').length;
        if (targ) {
          $('body').addClass('expand-menu');
          $('.subdrop + ul').slideDown();
        } else {
          $('body').removeClass('expand-menu');
          $('.subdrop + ul').slideUp();
        }
        return false;
      }
    });

    $('body').append('<div class="sidebar-overlay"></div>');
    $(document).on('click', '#mobile_btn', function() {
      let $wrapper = $('.main-wrapper');
      $wrapper.toggleClass('slide-nav');
      $('.sidebar-overlay').toggleClass('opened');
      $('html').addClass('menu-opened');
      $('#task_window').removeClass('opened');
      return false;
    });

    $('.sidebar-overlay').on('click', function () {
      let $wrapper = $('.main-wrapper');
        $('html').removeClass('menu-opened');
        $(this).removeClass('opened');
        $wrapper.removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        $('#task_window').removeClass('opened');
    });
  }
}
