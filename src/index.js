import {forEach, isEqual} from 'lodash';
import {test, paddle, slot} from './components';
import { gsap } from "gsap";
import './style/style.less';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';


// 1. for each quiz question loads up the corresponding paddles and slots (done)
// 2a. associate each paddle with their respective answer (done)
// 2b. load 5 paddles and 5 slots asynchronously and wait on user input (done)
// 3. if user has put all slots in place show "ok" button to confirm placement (done)
// 4. once user hits okay, paddles move to their correct slots using greensock

// bonus:
// number displaying number of correct answers
// paddles reset to starting positions, next questions and slots loaded
// timer?

// QUIZ MODEL
const quiz = {
    q1 : {
        questions : ['Ancient Ceremony', 'Middle Eastern Town', 'Flightless Bird', 'Deciduous Tree', 'Finnish Breakfast'],
        answers: ['Greater Rhea', 'Balsamifera', 'Triumphus', 'Perunarieska', 'Khor Fakkan']
    }
}

// QUIZ VIEW
let quizView = {
    // add 5 paddles
    // uses lodash function
    loadPaddles : function() {
        for (let key in quiz) {
            forEach(quiz[key].answers, function(text, value){
                document.querySelector('.paddle-container').appendChild(paddle(value, text));
            });
        }
    },
    // add 5 slots
    // uses lodash function
    loadSlots : function() {
        for (let key in quiz) {
            forEach(quiz[key].questions, function(text, value){
                document.querySelector('.slot-container').appendChild(slot(value, text));
            });
        }
    },

    welcome :       $(function() {
                        $('.intro-popup').show();

                        gsap.fromTo('.intro-popup', { opacity: 0 }, { opacity: 1 });
                        gsap.to('.intro-popup', {
                            y : '-50',
                        } )
                    }),

    interaction :  $(function(){

                    $(document).mouseup(function (e) {
                        if ($(e.target).closest(".intro-popup").length
                            === 0) {
                            gsap.to('.intro-popup', {
                                y : '50',
                            } )
                            gsap.fromTo('.intro-popup', { opacity: 1 }, { opacity: 0 });


                            setTimeout(function() {
                                $(".intro-popup").hide();
                            }, 500);
                        }
                    });

                    $('.paddle').on( "drag", function( event, ui ) {
                        // console.log(quizController.getSlotState());
                    } );

                    $('.slot').on( "drop", function(event, ui) {

                        window.paddleDropped.push(window.paddleID);

                        // if all paddles are placed
                        if (quizController.getPaddleState().check) {
                            quizController.complete(true);
                        } else {
                            quizController.complete(false);
                        }
                    });

                    $('.okay-button').on( 'click', function(){
                        quizController.submit();
                    })
            })
}

// QUIZ CONTROLLER
let quizController = {
    currentQuiz : 1,

    startQuiz : function(){
        console.log('quiz start');
        quizView.loadPaddles(this.currentQuiz);
        quizView.loadSlots(this.currentQuiz);
        this.initSlotState();
        this.initPaddleState();
        this.showSubmit(false);
    },

    initSlotState : function() {
        window.currentSlot = 'init';
        window.slots.slot0 = 'init';
        window.slots.slot1 = 'init';
        window.slots.slot2 = 'init';
        window.slots.slot3 = 'init';
        window.slots.slot4 = 'init';
    },

    initPaddleState : function() {
        window.paddleID = 'init';
        window.paddleState = 'init';
        window.paddleDropped = [];
        window.paddleCorrect = 0;
        window.paddleWrong = 0;
        window.check = false;
        window.complete = false;
    },

    complete : function(check) {
        if (check){
            window.complete = true;
            this.showSubmit(true)
        } else {
            window.complete = false;
            this.showSubmit(false);
        }
    },

    showSubmit : function(boolean){
        switch (boolean) {
            case true:
            $('.okay-button').show();
            break;
            case false:
            $('.okay-button').hide();
            break;
        }
    },

    submit : function(){
        // ok button functionality
        // check the slot state, compare against the correct arrangement
        let userAnswers = this.slotState();

        let correctOrder = {
            "slot0" : 'paddle2',
            "slot1" : 'paddle4',
            "slot2" : 'paddle0',
            "slot3" : 'paddle1',
            "slot4" : 'paddle3'
        };

        // use lodash function to compare two objects
        let check = isEqual(userAnswers, correctOrder);

        if (check){
            alert('congrats');
        } else {
            // check array of paddles and their slots
            let userValues = _.valuesIn(userAnswers);
            let correctValues = _.valuesIn(correctOrder);
            let results = {}

            // create keyed array (object) based on both values
            // then loop this and compare
            correctValues.forEach((key, index) => {
                results[key] = userValues[index];
            });

            console.log(results);

            let correctPosition = {
                'slot0' : 255,
                'slot1' : 500,
                'slot2' : 745,
                'slot3' : 990,
                'slot4' : 1235
            }

            // TODO: current position -/+ correct position
            // use greensock function based values
            // current position equals

            // correct position take current position

            // if the value equals the key, move on to next
            // if not, move the paddle to the correct position
            _.forIn(results, function(value, key) {
                console.log(correctPosition[value]);
                if (key !== value){
                    gsap.to(`#${value}`, { color : 'red' } )
                    gsap.to(`#${value}`, {
                        y : '70',
                        x : function(index, target, targets) { //function-based value
                            return index * 50;
                        }
                    } )
                    $(`#${value}`).addClass('wrong');
                    $('.slot').removeClass('dropped');
                } else {
                    gsap.to(`#${value}`, { color : 'green' } )
                }
            });

            // console.log('test 1 ' + test1);
            // console.log('test 2 ' + test2);

            // compare to their correct slots
            // move paddles to correct slots
        }
    },

    slotState : function() {
        return  {
            "slot0" : window.slots.slot0,
            "slot1" : window.slots.slot1,
            "slot2" : window.slots.slot2,
            "slot3" : window.slots.slot3,
            "slot4" : window.slots.slot4
        };
    },

    paddleState : function() {
        return {
            ID: paddleID,
            state: window.paddleState,
            dropped: window.paddleDropped,
            correct: window.paddleCorrect,
            wrong: window.paddleWrong,
            check: window.paddleDropped.length === 5,
        }
    },

    getPaddleState : function() {
        return this.paddleState();
    },
    getSlotState : function() {
        return this.slotState();
    }

}

// complete: (function() {
//     window.paddleDropped.length === 5 ?
//         window.complete = true && this.showSubmit(true) :
//         window.complete = false && this.showSubmit(false);
//     return window.paddleDropped.length === 5;
// })

quizController.startQuiz();