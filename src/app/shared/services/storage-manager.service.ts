import { Injectable } from '@angular/core';

@Injectable()
export class StorageManagerService {

  static storeLogoPath(path) {
    localStorage.setItem('logopath', path);
  }

  static getLogoPath() {
    return localStorage.getItem('logopath');
  }

  static storeToken(token) {
    localStorage.setItem('token', token);
  }


  static storeAllUsers(users) {
    localStorage.setItem('allUsers', JSON.stringify(users));
  }

  static getAllUsers() {
    return JSON.parse(localStorage.getItem('allUsers'));
  }

  static storeDepartment(departments) {
    localStorage.setItem('departments', JSON.stringify(departments));
  }
  static getDepartment() {
    return JSON.parse(localStorage.getItem('departments'));
  }

  static storeDesignation(designations) {
    localStorage.setItem('designations', JSON.stringify(designations));
  }
  static getDesignation() {
    return JSON.parse(localStorage.getItem('designations'));
  }

  static storeLocation(locations) {
    localStorage.setItem('locations', JSON.stringify(locations));
  }
  static getLocation() {
    return JSON.parse(localStorage.getItem('locations'));
  }

  static storeManageUser(manageuser) {
    localStorage.setItem('manageuser', JSON.stringify(manageuser));
  }
  static getManageUser() {
    return JSON.parse(localStorage.getItem('manageuser'));
  }

  static storeRoles(Roles) {
    localStorage.setItem('roles', JSON.stringify(Roles));
  }
  static getRoles() {
    return JSON.parse(localStorage.getItem('roles'));
  }

  static storeBankAccount(bankaccount) {
    localStorage.setItem('bankaccount', JSON.stringify(bankaccount));
  }
  static getBankAccount() {
    return JSON.parse(localStorage.getItem('bankaccount'));
  }

  static storeAccountTypes(accounTypes) {
    localStorage.setItem('accounTypes', JSON.stringify(accounTypes));
  }
  static getAccountTypes() {
    return JSON.parse(localStorage.getItem('accounTypes'));
  }

  static storeQualifications(qualifications) {
    localStorage.setItem('qualifications', JSON.stringify(qualifications));
  }
  static getQualifications() {
    return JSON.parse(localStorage.getItem('qualifications'));
  }

  static storeDateTimeFormat(format) {
    localStorage.setItem('dateTimeFormat', JSON.stringify(format));
  }

  static getDateTimeFormat() {
    return JSON.parse(localStorage.getItem('dateTimeFormat'));
  }
  // static storeBankAccount(bankaccount) {
  //   localStorage.setItem('bankaccount', JSON.stringify(bankaccount));
  // }
  static getToken() {
    return localStorage.getItem('token');
  }

  static lockApp() {
    localStorage.setItem('lock', 'app');
  }

  static getLockStatus() {
    return localStorage.getItem('lock');
  }

  static unlockApp() {
    localStorage.removeItem('lock');
  }

  static storeUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getUser() {
    return localStorage.getItem('user');
  }

  static clearAll() {
    localStorage.clear();
  }

  static storeNavs(navs) {
    localStorage.setItem('navs', JSON.stringify(navs));
  }

  static getNavs() {
    return JSON.parse(localStorage.getItem('navs'));
  }
}
