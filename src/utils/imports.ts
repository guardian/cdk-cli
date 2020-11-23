export enum importType {
  REQUIRE="require",
  ALL="all",
  COMPONENT="component"
}

interface BaseImportProps {
  type: importType;
}

interface ComponentImportProps extends BaseImportProps {
  type: importType.COMPONENT;
  components: string[];
}

interface OtherImportProps extends BaseImportProps {
  type: importType.ALL | importType.REQUIRE;
  name: string;
}

export class Imports {
  imports: { [lib: string]: ComponentImportProps | OtherImportProps } = {};

  addImport(lib: string, props: ComponentImportProps | OtherImportProps): void {
    if (!this.imports[lib]) {
      this.imports[lib] = props;
      return;
    }

    if (this.imports[lib].type !== props.type) {
      throw new Error(
        `This library has already been added but using a different import type - Current: ${this.imports[lib].type} Requested: ${props.type}`
      );
    }

    if (props.type === importType.COMPONENT) {
      const foo = props as ComponentImportProps
      const bar = this.imports[lib] as ComponentImportProps

      bar.components = [
        ...new Set(
          (bar.components || []).concat(foo.components || [])
        ),
      ];
    }
  }
}
