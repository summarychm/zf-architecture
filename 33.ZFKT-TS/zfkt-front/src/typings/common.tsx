// action接口
export interface TypeAction {
	type: string;
	payload: any;
}
// 课程分类
export enum EnumCategory {
	"all" = "all",
	"react" = "react",
	"vue" = "vue",
}
