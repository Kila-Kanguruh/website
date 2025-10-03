import { defineCollection, z } from "astro:content";

const title = `
  show
  title
  content
  image {
    node {
      sourceUrl
      altText
    }
  }
  link {
    title
    url
  }
`;

const callout = `
  ${title}
`;

const info = `
  ${title}
  imagePosition
`;

const query = `
  query Home {
    page(id: "/home", idType: URI) {
      id
      home {
        title1 {
          ${title}
        }
        title2 {
          ${title}
        }
        title3 {
          ${title}
        }
        title4 {
          ${title}
        }

        callout1 {
          ${callout}
        }
        callout2 {
          ${callout}
        }

        info1 {
          ${info}
        }
        info2 {
          ${info}
        }
        info3 {
          ${info}
        }
        info4 {
          ${info}
        }
      }
    }
  }
`;

const TitleSchema = z.object({
  show: z.boolean(),
  title: z.string().nullish(),
  content: z.string().nullish().nullish(),
  image: z
    .object({
      node: z.object({
        sourceUrl: z.string().url().nullish(),
        altText: z.string().nullish(),
      }),
    })
    .nullish(),
  link: z
    .object({
      title: z.string().nullish(),
      url: z.string().url().nullish(),
    })
    .nullish(),
});

const CalloutSchema = z.object({
  ...TitleSchema.shape,
});

const InfoSchema = z.object({
  ...TitleSchema.shape,
  imagePosition: z
    .union([z.literal("left"), z.literal("right")])
    .array()
    .default(["left"]),
});

export type Callout = z.infer<typeof CalloutSchema>;
export type Info = z.infer<typeof InfoSchema>;
export type Title = z.infer<typeof TitleSchema>;

export const home = defineCollection({
  loader: async () => {
    console.log("Loading home collection data...");
    const response = await fetch("https://backend.kilakaenguruh.de/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        ${query}
      `,
      }),
    });

    const json = await response.json();
    console.log(json);
    return [json.data.page];
  },
  schema: z.object({
    id: z.string(),
    home: z.object({
      title1: TitleSchema,
      title2: TitleSchema,
      title3: TitleSchema,
      title4: TitleSchema,
      callout1: CalloutSchema,
      callout2: CalloutSchema,
      info1: InfoSchema,
      info2: InfoSchema,
      info3: InfoSchema,
      info4: InfoSchema,
    }),
  }),
});
