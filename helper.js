
module.exports = {
    checkEmpty:function(obj){
        return (Object.entries(obj).length === 0 && obj.constructor === Object);
    },
    getDate:function (){
        	
        var today = new Date();
        return ((today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear());
        
    },
    getDateTime:function (){

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return `${date} ${time}`;
    }
}