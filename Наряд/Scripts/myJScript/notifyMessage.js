function notifyMessage(textMessage, classStyles) {  //окно сообщеиня
    $.notify(textMessage, {
        globalPosition: "top center",
        className: classStyles
    });
}