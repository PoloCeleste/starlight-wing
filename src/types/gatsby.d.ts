declare module "gatsby" {
  import React from "react";

  export interface NavigateOptions {
    state?: object;
    replace?: boolean;
  }

  export const navigate: (
    to: string,
    options?: NavigateOptions
  ) => Promise<void>;

  export interface GatsbyLinkProps<TState>
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
    state?: TState;
    replace?: boolean;
  }

  export const Link: React.FC<GatsbyLinkProps<any>>;

  export type PageProps<
    DataType = object,
    PageContextType = object,
    LocationState = object
  > = {
    path: string;
    uri: string;
    location: Location;
    data: DataType;
    pageContext: PageContextType;
  };

  export type HeadFC<DataType = object, PageContextType = object> = React.FC<
    HeadProps<DataType, PageContextType>
  >;

  export interface HeadProps<DataType = object, PageContextType = object> {
    location: Location;
    data: DataType;
    pageContext: PageContextType;
  }
}
