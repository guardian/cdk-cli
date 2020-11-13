export interface ImportProps {
  type: 'require' | 'all' | 'component';
  components?: string[];
  name?: string;
}

export class Imports {
  imports: { [lib: string]: ImportProps } = {};

  addImport(lib: string, props: ImportProps): void {
    if (!this.imports[lib]) {
      this.imports[lib] = props;
      return;
    }

    if (this.imports[lib].type !== props.type) {
      throw new Error(
        `This library has already been added but using a different import type - Current: ${this.imports[lib].type} Requested: ${props.type}`
      );
    }

    if (props.type === 'component') {
      this.imports[lib].components = [
        ...new Set(
          (this.imports[lib].components || []).concat(props.components || [])
        ),
      ];
    }
  }
}
