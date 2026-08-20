export default function Features(){

return (

<section className="py-16 bg-gray-50">


<h2 className="text-3xl font-bold text-center text-green-700">
Why Choose YieldSense AI?
</h2>


<div className="
mt-10
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-6
px-8
">


<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-semibold">
🌾 Yield Prediction
</h3>

<p className="mt-3 text-gray-600">
Predict crop yield using Machine Learning models.
</p>

</div>



<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-semibold">
🌦 Weather Intelligence
</h3>

<p className="mt-3 text-gray-600">
Analyze weather conditions affecting crops.
</p>

</div>



<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-semibold">
🌱 Soil Analysis
</h3>

<p className="mt-3 text-gray-600">
Understand soil parameters for better farming decisions.
</p>

</div>



<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-semibold">
📊 Analytics Dashboard
</h3>

<p className="mt-3 text-gray-600">
Visualize farming insights and predictions.
</p>

</div>


</div>


</section>

)

}