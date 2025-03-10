export function helloWorld(name?: string): void {
  console.log(`Hello, ${name || "World"}!`);
}
