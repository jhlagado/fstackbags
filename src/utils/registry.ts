export const objects:any[] = [];

export const register = (object:any) => {
    objects.push(object);
    return objects.length - 1;
}

export const lookup = (id:number) => {
    return objects[id];
}
