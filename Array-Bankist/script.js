'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');






// displayMovements(account1.movements)
const displayMovements = function(movements, sort = false)
{
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a -b) : movements

  movs.forEach( function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}$</div>
  </div>
  `;
  containerMovements.insertAdjacentHTML('afterbegin', html)
  });

}


// calcDisplayBalance(account1.movements)
const calcDisplayBalance = (acc) =>{
  acc.balance = acc.movements.reduce((accumulator, current) => 
    accumulator + current, 0
  )
  labelBalance.textContent = `${acc.balance}$`
}


// calcDisplaySummary(account1.movements)
const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov > 0)
                           .reduce((acc, mov) => acc + mov, 0)

  labelSumIn.textContent = `${incomes}$`           
  
  const out = acc.movements.filter(mov => mov < 0)
                        .reduce((acc, mov) => acc+mov, 0)

  labelSumOut.textContent = `${Math.abs(out)}$`

  //  interest = 1.25
  const interest = acc.movements.filter(mov => mov > 0)
                              .map(deposit => (deposit * acc.interestRate) / 100)
                              .filter((int, i, arr) => {
                               return int >= 1
                            })
                            .reduce((acc, int) => acc+int, 0)


  labelSumInterest.textContent = `${interest}$`

}

// CREATE USERNAME
const createUserName = function(accs) {
  accs.forEach(acc =>{
    acc.userName = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  })

}
createUserName(accounts)

// UPDATE UI
const updateUI = function(acc){
  // Display movements
  displayMovements(acc.movements)

  // Display Balance
  calcDisplayBalance(acc)

  // Display Summary
  calcDisplaySummary(acc)
}



// Event Handler
let currentAccount;
btnLogin.addEventListener('click', (e) => {
  e.preventDefault()

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
    )
    // console.log(currentAccount);

    if(currentAccount?.pin === Number(inputLoginPin.value)){ // ?. --> OPTIONAL CHAINING

      // Display UI and Display Message
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;

      containerApp.style.opacity = 100
      // clear input fields
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur(); // to lose its focus

      // Update UI
      updateUI(currentAccount)

    }
})

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value)

  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  )
  inputTransferTo.value = inputTransferAmount.value = ''
  inputTransferAmount.blur()

  // TRANSFER VALID ?
  if(
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ){
    currentAccount.movements.push(-amount)
    receiverAcc.movements.push(amount)
    updateUI(currentAccount)
  }
})

// Loan
btnLoan.addEventListener('click', (e) => {
  e.preventDefault()

  const amount = Number(inputLoanAmount.value)

  if(amount > 0 && 
    currentAccount.movements.some(mov => mov >= amount * 0.1)
  ){
    // Add the movement 
    currentAccount.movements.push(amount)

    // Update UI
    updateUI(currentAccount)
  }
  else {
    window.confirm("Can't be prompted loan 10% of the maximum deposit amount")
  }
  inputLoanAmount.value = ''
})

//For closing account
btnClose.addEventListener('click', (e) => {
  e.preventDefault()
  // console.log("DELETE");

  if(inputCloseUsername.value === currentAccount.userName &&
     Number(inputClosePin.value) === currentAccount.pin  
  ){
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName)
    // console.log(index);

    accounts.splice(index, 1)

    containerApp.style.opacity = 0
  }
  inputCloseUsername.value = inputClosePin.value = ''
  inputClosePin.blur()
})


// sorting the movements
let sorted = false
btnSort.addEventListener('click',(e) => {
  e.preventDefault()

  displayMovements(currentAccount.movements, !sorted)
  sorted  = !sorted
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


// const rupeesToUSD = 1.1

// const movementsUSD = movements.map(mov => mov * rupeesToUSD);

// console.log(movements);
// console.log(movementsUSD);

const movementsDescriptions = movements.map((mov, i, arr) =>
  `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew' } ${Math.abs(mov)}`
)

// console.log(movementsDescriptions);

const deposits = movements.filter(mov => mov > 0)
const withdrawal = movements.filter( mov => mov < 0)

// console.log(movements);
// console.log(deposits);
// console.log(withdrawal);


const max = movements.reduce((acc, mov) => {
  if(acc > mov)
    return acc
  else
    return mov 
}, movements[0])

// console.log(max);

// The chainning method


const rupeesToUSD = 1.1
// PIPELINE
const totalDepositToUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * rupeesToUSD)
  .reduce((acc, mov) => acc + mov, 0)



// flat
const overallBalance1 = accounts.map(acc => acc.movements)
                       .flat()
                       .reduce((acc, mov) => acc + mov, 0)
console.log(overallBalance1);

const overallBalance2 = accounts
                       .flatMap(acc => acc.movements)
                       .reduce((acc, mov) => acc + mov, 0)
console.log(overallBalance2);

// Array.from
// labelBalance.addEventListener('click', (e) => {
//   e.preventDefault()

//   const movUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('$', ''))
//   )
//   console.log(movUI);


//   const movUI2 = [...document.querySelectorAll('.movements__value')]
//   console.log(movUI2);
// })