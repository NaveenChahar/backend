
class delBoyModel{
    constructor(){
        this.empId=null;
    this.status=null;
    this.pendingOrders=[];
    this.previousOrders=[];
    this.rating=null;
    this.totalOrdersToday=null;
    this.totalOrdersDelivered=null;
    this.notifications=[];
    this.location={
        coordinates:[],
        type:"Point"
    }
    this.verified=false;
    }
}

module.exports=delBoyModel;