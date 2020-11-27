export class Imports {
  imports: { [lib: string]: string[] } = {};

  addImport(lib: string, components: string[]): void {
    if (!this.imports[lib]) {
      this.imports[lib] = components;
      return;
    }

    this.imports[lib] = [
      ...new Set((this.imports[lib] || []).concat(components || [])),
    ];
  }
}
