import {join} from "lodash";
import {gsap} from "gsap";

export function test() {
    const element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
}

/**
 * @param value
 * @param {string} text
 */
export function paddle(value, text) {
    const paddle = document.createElement('div');
    paddle.classList.add('paddle');
    paddle.id = 'paddle' + value;
    paddle.innerHTML = `<p>${text}</p>`;

    $(function (){
        $('.paddle').hover(function() {
            $(this).addClass('hover');
        });

        $('.paddle').draggable({
            snap: '.slot',
            snapMode: 'inner',
            snapTolerance: 90,
            cursor: 'pointer',
            classes: {'ui-draggable-dragging' : 'dragging'},

            drag: function( event, ui ) {
                window.paddleState = 'dragging';
            },
            start: function(event, ui) {
                window.paddleID = this.id;
                window.paddleState = 'start';
                gsap.fromTo(`#${window.paddleID}`, { opacity: 1 }, { opacity: 0.5 });
                gsap.to(`#${window.paddleID}`, { scale : 1.2, duration : 0.15 } )
            },

            stop: function(event, ui) {
                window.paddleState = 'stop';
                gsap.fromTo(`#${window.paddleID}`, { opacity: 0.5 }, { opacity: 1 });
                gsap.to(`#${window.paddleID}`, { scale : 1, duration : 0.15 } )
                window.paddleID = '';
            },
        });

    });

    return paddle;
}

/**
 * @param value
 * @param {string} text
 */
export function slot(value, text) {
    const slot = document.createElement('div');
    slot.classList.add('slot');
    slot.id = 'slot' + value;
    slot.innerHTML = text;

    //for example
    window.slots = {
        slot0 : 'init',
        slot1 : 'init',
        slot2 : 'init',
        slot3 : 'init',
        slot4 : 'init'
    }

    $(function () {
        $('.slot').droppable({
            accept: '.paddle',
            hoverClass: 'dropped',
            drop: function(event,ui){
                window.currentSlot = this.id;
                slots[this.id] = window.paddleID;
            },
            out: function( event, ui ) {
                window.currentSlot = ''
                window.paddleDropped =
                    window.paddleDropped
                        .filter(paddle => paddle !== window.paddleID);
            }
        });
        $('.slot').on('drop', function(event,ui) {
            $(this).addClass('dropped');
        });
        $('.slot').on('dropout', function(event,ui) {
            $(this).removeClass('dropped');
        });
    });

    return slot;
}