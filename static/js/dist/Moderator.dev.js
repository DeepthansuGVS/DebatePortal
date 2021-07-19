"use strict";

var textbox = document.querySelector(".chits_box"),
    Success = "",
    errorMessage = "",
    form = document.querySelector("form"),
    old_messages = [],
    result = [],
    authState = document.querySelector(".auth_state");
var reply_to_id,
    type = "send",
    url,
    inputField = document.querySelector('#sendTo'),
    sendButton = document.querySelector('.chit_send_button'),
    inputFieldDev = document.querySelector(".input_country"),
    csrf = document.querySelector(".csrf"),
    chit_div;

var SetMessages = function SetMessages(url) {
  return regeneratorRuntime.async(function SetMessages$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Messages(url));

        case 2:
          new_messages = _context.sent;
          result = new_messages.filter(function (message) {
            return !old_messages.some(function (message2) {
              return message.id === message2.id;
            });
          });
          result.forEach(function (message, i) {
            var wrapper = document.createElement('div');
            wrapper.classList.add("single_chit");
            wrapper.style.animationDelay = "".concat((result.length - i - 1) * 0.1, "s");
            var header = document.createElement('div');
            header.classList.add("from");
            var content = document.createElement('div');
            content.classList.add("content");
            var button_wrapper = document.createElement('div');
            button_wrapper.classList.add('reply_button');
            var ApproveButton = document.createElement('button');
            var DisapproveButton = document.createElement('button');
            content.textContent = message.chit;
            header.textContent = "From: " + message.chit_from.name + " <" + message.chit_from.country_id + ">";

            if (message.reply_to_country) {
              var replyHeader = document.createElement('div');
              replyHeader.textContent = "Reply from " + message.chit_from.name + " to " + message.reply_to_country + "'s" + " message";
              wrapper.appendChild(replyHeader);
            }

            ApproveButton.textContent = "Approve";
            DisapproveButton.textContent = "Disapprove";
            ApproveButton.addEventListener('click', function () {
              ApproveButton.disabled = true;
              ApproveButton.classList.add('clicked');
              fetch('/chits/moderator/', {
                method: 'POST',
                body: JSON.stringify({
                  chit_id: message.id
                }),
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrf.value
                }
              }).then(function (response) {
                return response.json();
              }).then(function (data) {
                Success = data.message;
                chit_div = document.getElementById(message.id);
                wrapper.classList.add('slide__out');
                setTimeout(function () {
                  chit_div.remove();
                }, 500);
              })["catch"](function (error) {
                return errorMessage = error.message;
              });
              setTimeout(function () {
                ApproveButton.disabled = false;
                ApproveButton.classList.remove('clicked');
              }, 2000);
            });
            DisapproveButton.addEventListener('click', function () {
              DisapproveButton.disabled = true;
              DisapproveButton.classList.add('clicked');
              fetch('/chits/moderator/disapprove/', {
                method: 'POST',
                body: JSON.stringify({
                  chit_id: message.id
                }),
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrf.value
                }
              }).then(function (response) {
                return response.json();
              }).then(function (data) {
                Success = data.message;
                chit_div = document.getElementById(message.id);
                wrapper.classList.add('slide__out');
                setTimeout(function () {
                  chit_div.remove();
                }, 500);
              })["catch"](function (error) {
                return errorMessage = error.message;
              });
              setTimeout(function () {
                DisapproveButton.disabled = false;
                DisapproveButton.classList.remove('clicked');
              }, 1000);
            });
            button_wrapper.appendChild(ApproveButton);
            button_wrapper.appendChild(DisapproveButton);
            wrapper.appendChild(header);
            wrapper.appendChild(content);
            wrapper.appendChild(button_wrapper);
            wrapper.setAttribute("id", "".concat(message.id));
            wrapper.style.transform = "translate(0px)";
            textbox.prepend(wrapper);
          });
          old_messages = new_messages;

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

if (authState.value === "True") {
  setInterval(function () {
    return SetMessages("any");
  }, 8000);
}