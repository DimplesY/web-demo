import Vue from 'vue'
import HelloWord from './HelloWorld.vue'

const HelloWordConstructor = Vue.extend(HelloWord)

const instance = new HelloWordConstructor()
instance.$mount()

document.body.appendChild(instance.$el)

