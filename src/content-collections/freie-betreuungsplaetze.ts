import { defineCollection, z } from "astro:content";

const callout = `
  show
  title
  heading
  content
`;

const query = `
  query FreieBetreuungsplaetze {
    page(id: "/freie-betreuungsplaetze", idType: URI) {
      id
      freieBetreuungsplaetze {
        title
        titleimage {
          node {
            sourceUrl
            altText
          }
        }
        callout1 {
          ${callout}
        }
        callout2 {
          ${callout}
        }
        footer
      }
    }
  }
`;

const CalloutSchema = z.object({
  show: z.boolean(),
  title: z.string().nullish(),
  heading: z.string().nullish(),
  content: z.string().nullish(),
});

export type Callout = z.infer<typeof CalloutSchema>;

export const freieBetreuungsplaetze = defineCollection({
  loader: async () => {
    console.log("Loading freie-betreuungsplaetze collection data...");
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
    freieBetreuungsplaetze: z.object({
      title: z.string().nullish(),
      titleimage: z
        .object({
          node: z.object({
            sourceUrl: z.string().url().nullish(),
            altText: z.string().nullish(),
          }),
        })
        .nullish(),
      callout1: CalloutSchema,
      callout2: CalloutSchema,
      footer: z.string().nullish(),
    }),
  }),
});
