export class Imports {
  imports: Record<string, string[]> = {
    "@aws-cdk/core": ["App", "StackProps"],
    "@guardian/cdk/lib/constructs/core": ["GuStack"],
  };

  addImport(lib: string, components: string[]): void {
    if (!Object.keys(this.imports).includes(lib)) {
      this.imports[lib] = components;
      return;
    }

    this.imports[lib] = [...new Set(this.imports[lib].concat(components))];
  }
}
