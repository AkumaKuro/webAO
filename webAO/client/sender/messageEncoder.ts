export { encode }

function encode(type: string, args: string[]) : string {
    return type + args.join('#') + '%'
}