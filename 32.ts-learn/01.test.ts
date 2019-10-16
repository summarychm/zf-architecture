// 我有我天地
// 何故.何苦.何必
// 祝福你

export {};

// enum sex {
// 	man = "man",
// 	woman = "woman",
// }
// interface iUser {
// 	name: string;
// 	age?: number;
// 	readonly sex: sex;
// 	[xx: string]: any;
// }

// let user1: iUser = {
// 	name: "小明",
// 	age: 15,
// 	sex: sex.man,
// };

// interface iGetName {
// 	(user: iUser, cb: Function): void;
// }

// const getName: iGetName = function(user, cb) {
// 	cb(user);
// };

// getName(user1, (arg: any) => {
// 	console.log("cb", arg);
// });

// class Animal {
// 	private name: string;
// 	constructor(theName: string) {
// 		this.name = theName;
// 	}
// 	getName(): void {
// 		console.log(this.name);
// 	}
// }

// let ani = new Animal("Cat"); // 错误: 'name' 是私有的.
// ani.getName();

// let myAdd = function(x: number, y: number): number {
// 	return x + y;
// };

// function identity<T>(arg: T): T {
// 	return arg;
// }
// let myIdentity: { <T>(arg: T): T } = identity;

// myIdentity(5);

export const ActionCreator = <T = void>(type: any = Symbol()) =>
	Object.assign((payload: T) => ({ type, payload }), {
		match: (a: any): a is { payload: T } => a && a.type === type,
	});
ActionCreator(11);

abstract class Animal {
	abstract speak(): void;
	getName(): void {
		console.log("this", this);
	}
}
class Dog extends Animal {
	speak() {
		console.log("小狗汪汪汪");
	}
}
class Cat extends Animal {
	speak() {
		console.log("小猫喵喵喵");
	}
}
let dog = new Dog();
let cat = new Cat();
dog.speak();
cat.speak();
dog.getName();



