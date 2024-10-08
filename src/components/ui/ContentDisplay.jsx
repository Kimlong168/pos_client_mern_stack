import PropTypes from "prop-types";
const ContentDisplay = ({ htmlString }) => {
  //   Use a regular expression to find the oembed element in the HTML string
  const oembedRegex = /<oembed[^>]*>/g;
  const oembedMatches = htmlString?.match(oembedRegex);

  // convert oembed to iframe (youtube video)
  if (oembedMatches) {
    oembedMatches.forEach((oembedMatch) => {
      const oembedUrl = oembedMatch.match(/url="([^"]*)"/)[1];
      let rightUrl = oembedUrl.replace("youtu.be", "youtube.com/embed");
      const iframeElement = `<iframe width="100%" height="370px"  src="${rightUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      htmlString = htmlString.replace(oembedMatch, iframeElement);
    });
  }

  return (
    <div className="prose-pre:w-[100%] prose prose-h1:m-0 prose-h2:m-0 prose-h3:m-0 prose-h4:m-0 prose-p:m-0 prose-p:mt-2 prose-a:text-blue-500 prose-a:cursor-pointer max-w-full">
      <div
        className="break-all "
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    </div>
  );
};
ContentDisplay.propTypes = {
  htmlString: PropTypes.string.isRequired,
};
export default ContentDisplay;
