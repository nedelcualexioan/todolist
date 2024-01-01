let getDate = () => {
    const date = new Date();
    const options = {
            weekday: "long", 
            month: "long",
            day: "numeric"
    };
    return date.toLocaleDateString("en-US", options);
}


exports.getDate = getDate;