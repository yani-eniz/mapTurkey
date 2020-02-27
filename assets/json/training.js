/*
let rectangle = {
    width: 100,
    height: 20,
    getSquare: function getSquare() {
        console.log(this.width * this.height);
    }

};
rectangle.getSquare();*/

/*let priceWithDiscount = {
    price: 10,
    discount: '15%',
    getPrice: function getPrice() {
        console.log(this.price)
    },
    getPriceWithDiscount: function getPriceWithDiscount() {
        console.log(this.price - (this.price * (parseInt(this.discount)/100)))
    }
};
priceWithDiscount.getPrice();
priceWithDiscount.getPriceWithDiscount();*/

/*
let obj = {
    height: 10,
    heightInc: function heightInc() {
        console.log(++this.height)
    }
};
obj.heightInc();*/


/*const numerator = {
    value: 5,
    double: function () {
        console.log(this.value*2);
        return this
    },
    plusOne: function () {
        console.log(++this.value);
        return this
    },
    minusOne: function () {
        console.log(this.value - 1);
        return this
    }
};
numerator.double().plusOne().minusOne();*/

const products = {
    currencyOne: 20,
    numberOf: 10,
    totalCurrency: function totalCurrency() {
        console.log(`$${this.currencyOne*this.numberOf}`);
        return this
    }
};

const details = {
    currencyOne: 27,
    numberOf: 13
};
products.totalCurrency.call(details);



