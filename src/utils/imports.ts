export class Imports {
  imports: { [lib: string]: string[] } = {
    "@aws-cdk/core": ["Construct", "StackProps"],
    "@guardian/cdk/lib/constructs/core": ["GuStack"]
  };

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
