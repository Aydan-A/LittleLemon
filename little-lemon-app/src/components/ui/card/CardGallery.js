import './card.css';

const specials = [
  {
    id: 'tasting',
    title: 'Chef tasting',
    price: '$68',
    description:
      'A five-course mezze flight inspired by peak-season produce and house ferments.',
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'paella',
    title: 'Sunset paella',
    price: '$42',
    description:
      'Wild shrimp, razor clams, saffron sofrito, charred lemon aioli, crisp socarrat.',
    image:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'citrus',
    title: 'Citrus grove dessert',
    price: '$18',
    description:
      'Olive oil cake, preserved lemon cream, brûléed grapefruit, basil granita.',
    image:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
  },
];

function CardGallery() {
  return (
    <div className="card-gallery">
      {specials.map((item) => (
        <article key={item.id} className="card">
          <img className="card-img" src={item.image} alt={item.title} />
          <div className="card-body">
            <div className="card-details">
              <h3 className="card-title">{item.title}</h3>
              <span className="card-price">{item.price}</span>
            </div>
            <p className="card-description">{item.description}</p>
            <p className="card-delivery">Available tonight</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default CardGallery;
